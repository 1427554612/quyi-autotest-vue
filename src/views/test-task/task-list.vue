<template>
    <div id="app">
      <div id="card" style="width:auto;margin-top: 10px;margin-left: 20px;" >
        <el-card class="box-card" style="width:98%;margin-left: 15px;margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span style="font-size:20px;font-weight: bolder;">定时任务</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        
        <div id="options">
          <el-form :inline="true" :model="taskQuery" class="demo-form-inline">
            <el-form-item label="任务id">
              <el-input v-model="taskQuery.id" placeholder="任务id"></el-input>
            </el-form-item>
            <el-form-item label="任务名称">
              <el-input v-model="taskQuery.name" placeholder="任务" ></el-input>
            </el-form-item>
            <el-form-item label="执行类型">
              <el-select v-model="taskQuery.dype" placeholder="执行类型">
                <el-option label="时间" value="date"></el-option>
                <el-option label="cron表达式" value="cron"></el-option>
              </el-select>
            </el-form-item>
            <el-date-picker
              v-model="taskQuery.lastBeginTime"
              type="datetime"
              placeholder="开始时间">
            </el-date-picker>
            <el-date-picker
              v-model="taskQuery.lastBeginTime"
              type="datetime"
              placeholder="结束时间">
            </el-date-picker>
            <el-form-item>
              <el-button type="primary" @click="getList()" style="margin-left: 20px;" icon="el-icon-search">查询</el-button>
              <el-button v-on:click="resetting()">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div>
            <el-button type="primary" @click="dialogFormVisible =true">添加定时任务</el-button>
        </div>
        <div id="list">
          <el-table
            :data="taskLsit" border style="width: 100%;margin-top:10px"  >
            <el-table-column fixed prop="id" label="任务id" width=180></el-table-column>
            <el-table-column prop="name" label="任务名称" width=120></el-table-column>
            <el-table-column prop="type" label="执行类型" width=80></el-table-column>
            <el-table-column prop="cron" label="cron表达式" width=100></el-table-column>
            <el-table-column prop="cronParse" label="cron解释" width=120></el-table-column>
            <el-table-column prop="date" label="间隔时间" width=80></el-table-column>
            <el-table-column prop="jobs" label="关联的任务" width=120>
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="" @click="showRelationDialog(scope.row.jobs)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width=160></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width=160></el-table-column>
            <el-table-column prop="beginTime" label="开始时间" width=160></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width=160></el-table-column>
            <el-table-column prop="taskStatus" label="执行状态" width=160 >
              <template slot-scope="scope" >
                {{ scope.row.taskStatus === 1 ? "执行中":scope.row.taskStatus== 2 ? "已暂停" : " 已终止" }}
              </template>
            </el-table-column>
            <el-table-column prop="runTime" label="执行耗时" width=160></el-table-column>
            <el-table-column prop="createBy" label="创建人" width=80></el-table-column>
            <el-table-column prop="lastBeginTime" label="最近执行时间" width=160></el-table-column>
            <el-table-column prop="caseCount" label="用例数" width=70></el-table-column>
            <el-table-column fixed="right" label="操作" width=360>
              <template slot-scope="scope" >
                <el-button type="info" plain size="small" @click="openRelevanceWindow(scope.row.id)">关联</el-button>
                <el-button @click="excuteTask(scope.row.id)" type="success" plain size="small" v-if="scope.row.taskRunLogs[0].runStatus==3">开始</el-button>
                <el-button @click="pauseTask(scope.row.id,scope.row.taskRunLogs[0].id )" type="success" plain size="small" v-if="scope.row.taskRunLogs[0].runStatus==1 || scope.row.taskRunLogs[0].runStatus==2" :ref="scope.row.taskRunLogs[0].id" >暂停</el-button>
                <el-button @click="remuseTask(scope.row.id,scope.row.taskRunLogs[0].id)" type="success" plain size="small" >继续</el-button>
                <el-button @click="stopTask(scope.row.id,scope.row.taskRunLogs[0].id)" type="warning" plain size="small">终止</el-button>
                <el-button @click="deleteTask(scope.row.id)" type="danger" plain size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
            <!--
                分页组件
            -->
            <div id="page">
                <el-pagination
                    @size-change="selectTaskPage"
                    @current-change="selectTaskPage"
                    :current-page.sync="currentPage"
                    :page-size="size"
                    layout="total, prev, pager, next"
                    :total="total" 
                    style="text-align:center">
                </el-pagination>
            </div>
        </div>

        <div>
            <el-input type="textarea" v-model="logData" v-if="taskStatu=='开始'"></el-input>
        </div>
      </el-card>
    </div>

    <!-- 列表查看已关联用例对话框 -->
    <div id="relationDialog">
      <el-dialog title="查询已关联的用例" :visible.sync="relationDialogDisible">
        <vue-json-editor v-model="showJobs" :showBtns="false" :mode="'code'"
                    @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="relationDialogDisible = false">取 消</el-button>
          <el-button type="primary" @click="relationDialogDisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 添加对话框 -->
    <div id="open-dialog">
      <el-dialog title="添加定时任务" :visible.sync="dialogFormVisible">
        <el-form :model="task" style="width:500px;margin:auto" :rules="validator">
          <el-form-item label="任务名称" :label-width="formLabelWidth" prop="taskName">
            <el-input v-model="task.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="执行方式" :label-width="formLabelWidth" prop="runType">
            <br />
            <el-select v-model="task.type" placeholder="请选择执行方式">
              <el-option label="间隔时间" value="date"></el-option>
              <el-option label="cron表达式" value="cron"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="cron表达式" :label-width="formLabelWidth" v-if="task.type!=='date'">
            <el-input v-model="task.cron" autocomplete="off" @blur="parseCronFunc"></el-input>
          </el-form-item>
          <el-form-item label="cron表达式解释" :label-width="formLabelWidth" v-if="task.type!=='date'">
            <el-input v-model="task.cronParse" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="执行间隔时间" :label-width="formLabelWidth" v-if="task.type==='date'">
            <el-input v-model="task.date" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建人" :label-width="formLabelWidth">
            <el-input v-model="task.createBy" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeTask()">取 消</el-button>
          <el-button type="primary" @click="addTask()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 关联用例对话框 -->
    <div id="open-dialog">
        <el-dialog title="关联测试用例" :visible.sync="relevanceIsShow">
          <div style="height: 50%; ">
              <el-table :data="allJobs" border="true" max-height="300" @selection-change="handleSelectionChange">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column prop="caseName" label="用例名称"></el-table-column>
              </el-table>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button @click="closeRelevance()">取 消</el-button>
            <el-button type="primary" @click="submitRelevance()" :disabled="relevanceButtonShow">确定关联</el-button>
          </div>
        </el-dialog>
    </div>

    <!-- 关联配置对话框 -->
    <div id="open-dialog">
        <el-dialog title="关联执行配置" :visible.sync="relevanceConfigIsShow">
          <div style="height: 50%; ">
              <el-table :data="allConfigs" border="true" max-height="300" @selection-change="handleSelectionConfigChange">
                  <el-table-column fixed type="selection"></el-table-column>
                  <el-table-column prop="configId" label="配置id"></el-table-column>
                  <el-table-column prop="configName" label="配置名称"></el-table-column>
                  <el-table-column prop="updateUp" label="创建人"></el-table-column>
              </el-table>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button @click="closeConfigDiglog()">取 消</el-button>
            <el-button type="primary" @click="submitConfigRelevance()" :disabled="relevanceButtonShow">确定关联</el-button>
          </div>
        </el-dialog>
    </div>

  </div>

</template>

<script>
import {cron} from 'vue-cron' // 使用方式：
import vueJsonEditor from 'vue-json-editor'
import cronstrue from "cronstrue/i18n";  // 引入表达式翻译
import taskApi from '@/api/test-task/taskApi'
import testConfigApi from '@/api/test-config/testConfigApi';
import apiTestApi from '@/api/api-autotest/apiTestApi';

// 定义变量
export default {
  components: { 
    cron:cron,
    vueJsonEditor:vueJsonEditor
   },
  data() {
    return {
      validator:{
          taskName:[{ required: true, message: '必须输入请求地址', trigger: 'blur' }],
          runType:[{ required: true, message: '必须选中执行类型', trigger: 'blur' }],
        },
      cronIsShow: false,    // 控制cron插件是否展示
      dialogFormVisible:false, // 添加对话框是否展示
      relevanceIsShow:false, // 关联对话框是否显示
      relevanceConfigIsShow:false,   // 关联配置对话框是否显示
      relationDialogDisible:false, //  查看已关联对话框是否显示
      showJobs:[],                 // 关联用例列表
      allJobs:[],                  // 接口中获取的所有用例列表
      allConfigs:[],               // 接口中获取的所有配置列表
      taskQuery:{             // 查询对象
        id:"",
        name:"",
        type:"",
        lastBeginTime:""
      },
      current:1,
      size:10,
      total:0,
      task:{
        name:"",
        type:"",
        date:0,
        cron:"",
        cronParse:"",
        createBy:""
      },
      taskLsit:[],     // 返回的任务列表
      caseList:[],      // 测试用例列表
      selectCaseList:[], // 需要关联选中的用例列表
      relevanceTaskId:"", // 需要关联的任务id
      relevanceConfigId:"",  // 关联配置id
      relevanceButtonShow:true, // 关联按钮是否禁用
      isIndeterminate: true,  //  全选样式
      status:['开始','暂停'],  // 执行状态
    };
  },
  created(){
      this.selectTaskPage();  // 初始化任务列表
  },
  methods:{
    // 当corn表达式的值发生变化变化时触发,参数是cron表达式的值
    parseCronFunc:function(v) {
      console.log(v)
      this.task.cronParse = cronstrue.toString(this.task.cron,{ locale: "zh_CN" });
      console.log(this.task.cronParse)
    },

    // 初始化任务列表
    initTaskList:function(){
      taskApi.selectAllTask().then(response=>{
        this.taskLsit = response.data.list
        console.log(this.taskLsit)
      })
    },

    //组合查询带分页
    selectTaskPage:function(current = 1){
        this.current = current
        taskApi.selectAllTaskAndPage(this.current,this.size,this.taskQuery).then(response=>{
            this.taskLsit = response.data.data.list
            console.log(this.taskLsit)
            this.total =  response.data.data.total
        })
    },
    
    // 添加定时任务
    addTask:function(){
      taskApi.addTask(this.task).then(response=>{
        this.dialogFormVisible = false
        this.$message({
          type:"success",
          message:"添加任务成功"
        })
        console.log(this.task)
        this.initTaskList()
        this.task = {}
      })
    },

    // 关闭添加定时任务弹框
    closeTask:function(){
      this.task = {};
      this.dialogFormVisible = false
    },
    
    // 编辑定时任务
    editTask:function(id){
      
    },

    // 打开查看关联任务弹框
    showRelationDialog:function(jobs){
        this.showJobs = jobs
        this.relationDialogDisible = true
    },

    // 打开关联定时任务弹框
    openRelevanceWindow:function(taskId){
      this.allJobs = []
        apiTestApi.selectAllCase().then(response=>{
          for(let i = 0; i < response.data.list.length;++i){
            this.allJobs.push({
              caseName:response.data.list[i].caseName
            })
            this.relevanceTaskId = taskId
          }
          this.relevanceIsShow = true;
        }).catch(error=> console.log("获取用例列表失败"))
    },

    // 关联用例列表改变后
    handleSelectionChange:function(caseList){
      if(caseList.length === 0 ){
        this.$message.error("至少需要选中选中一条关联....")
        this.relevanceButtonShow = true
      }
      else{
        for(let i = 0;i<caseList.length;++i){
          this.selectCaseList.push(caseList[i].caseName)
        }
        console.log("关联用例列表为：")
        console.log(this.selectCaseList)
        this.relevanceButtonShow = false
      }
    },

    // 关联配置列表改变后
    handleSelectionConfigChange:function(configList){
      if(configList.length === 0 || configList.length>1 ){
        this.$message.error("只能勾选一条配置")
        this.relevanceButtonShow = true
      }
      else{
        this.relevanceConfigId = configList[0].configId
        console.log("关联的配置id:" + this.relevanceConfigId)
        this.relevanceButtonShow = false
      }
    },

    // 确认关联用例
    submitRelevance:function(){
      // 二级关联、将配置对话框打开
      testConfigApi.selectAllConfig().then(response=>{
        this.allConfigs = response.data.list
        this.relevanceConfigIsShow = true
      })
    },

    // 确认关联配置
    submitConfigRelevance:function(){
      taskApi.relationCase(this.relevanceTaskId,this.selectCaseList,this.relevanceConfigId).then(response=>{
        this.$message({
          type:"success",
          message:"关联成功!!!"
        })
        this.closeConfigDiglog()
        this.selectTaskPage()
      })
    },

    // 关闭关联对话框
    closeRelevance:function(){
        this.relevanceIsShow = false
        this.selectCaseList = []
        this.relevanceTaskId = ""
        this.relevanceConfigId = ""
        this.selectTaskPage()
    },

    // 关闭配置对话框
    closeConfigDiglog:function(){
      this.relevanceTaskId = ""
        this.relevanceConfigIsShow = false
        this.closeRelevance()
    },


    // 开始执行
    async excuteTask(id){
      await taskApi.runTask(id).then(response=>{
        this.$message({
            type:"success",
            message:"开始执行任务..."
          })
        })
        await this.initTaskList()
    },

    // 暂停执行
    async pauseTask(id,logId){
      console.log(logId)
      await taskApi.pauseRunTask(id,logId).then(response=>{
          this.$message({
            type:"success",
            message:"暂停成功..."
          })
        })
        await this.initTaskList()
        console.log(this.$refs[logId])
        // 设置此按钮无法再点击
        this.$refs[logId].disabled = true
    },

    // 继续执行定时任务
    async remuseTask(taskId,logId){
      await taskApi.remuseRunTask(taskId,logId).then(response=>{
          this.$message({
            type:"success",
            message:"任务继续执行..."
          })
        })
        await this.initTaskList()
    },

    // 停止执行定时任务
    stopTask:function(taskId,logId){
      taskApi.stopTask(taskId,logId).then(response=>{
        this.$message({
            type:"success",
            message:"任务终止成功..."
          })
        this.initTaskList()
      })
    },

    // 删除定时任务
    deleteTask:function(id){
      this.$confirm('确认删除该定时任务么？' ,'提示:',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        taskApi.deleteTask(id).then(response=>{
        this.$message({
          type:"success",
          message:"删除定时任务成功"
        })
        this.initTaskList()
      })
      })
    
    }


  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    width: 98%;
  }
  i{
    font-size:10px
  }
</style>
