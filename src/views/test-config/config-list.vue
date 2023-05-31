<template>
    <el-card class="box-card" style="width:98%;margin-left: 15px;margin-top: 10px;">
        <div slot="header" class="clearfix">
            <span><b>测试全局配置</b></span>
        </div>

        <div id="config-query">
            <!-- 搜索项表单 -->
            <el-form :inline="true" class="demo-form-inline" style="margin-left: 20px">
                <el-form-item label="配置id" >
                    <el-input v-model="testConfigQuery.configId" placeholder="配置id"></el-input>
                </el-form-item>
                <el-form-item label="配置名称" >
                    <el-input v-model="testConfigQuery.configName" placeholder="配置名称"></el-input>
                </el-form-item>
                <el-form-item label="配置类型" >
                    <el-select v-model="testConfigQuery.configType" placeholder="请求类型">
                        <el-option label="api" value="api"></el-option>
                        <el-option label="web-ui" value="post"></el-option>
                        <el-option label="phone-ui" value="phone-ui"></el-option>
                        <el-option label="performance" value="performance"></el-option>
                    </el-select>
                </el-form-item>
                <el-from-item label="时间范围">
                    <el-date-picker v-model="testConfigQuery.beginTime" type="datetime" placeholder="开始时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    <el-date-picker v-model="testConfigQuery.endTile" type="datetime" placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
                </el-from-item>
                
                <el-form-item style="margin-left: 10px;">
                    <el-button @click="getConfigListAndPage()">查询</el-button>
                    <el-button @click="resetting()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 配置列表 --->
        <div id="config-list">
            <div>
                <el-button type="primary" size="max" icon="" @click="gotoConfigAddPage()" style="margin-top: 10px;">添加配置</el-button>
            </div>     
            <div style="margin-top: 20px;">
                <span><b>配置列表</b></span>      
            </div> 
            <el-table :header-cell-style="{'text-align':'center'}"  :data="configList" border style="width: 100%;margin-top: 10px;">
                <el-table-column fixed="left" prop="configId" label="配置id" width="250" align=center></el-table-column>
                <el-table-column prop="configName" label="配置名称" width="180" align=center></el-table-column>
                <el-table-column prop="configType" label="配置类型" width="180" align=center></el-table-column>
                <el-table-column prop="configData" label="配置数据" width="180" style="" align=center>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="" @click="showConfigDataDialog(scope.row.configData)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" align=center></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" width="180" align=center></el-table-column>
                <el-table-column prop="updateUp" label="修改人" width="180" align=center></el-table-column>
                <el-table-column fixed="right"  label="操作" align=center>
                    <template slot-scope="scope">
                        <router-link :to="'/config-edit/'+scope.row.configId">
                            <el-button type="info" size="mini" icon="el-icon-edit">编辑</el-button>
                        </router-link>
                        <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-left: 15px" @click="deleteConfig(scope.row.configId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div id="page">
            <el-pagination
                @size-change="getConfigListAndPage"
                @current-change="getConfigListAndPage"
                :current-page.sync="currentPage1"
                :page-size="size"
                layout="total, prev, pager, next"
                :total="total" 
                style="text-align:center">
            </el-pagination>
        </div>

        <!-- 配置数据弹框 -->
        <el-dialog title="测试配置" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" >
            <div style="width: 80%;height: 50%; margin-left: 100px;margin-top: 30px;">
                <vue-json-editor v-model="configData" :showBtns="false" :mode="'code'"
                    @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </el-card>
    
</template>
<script>
import vueJsonEditor from 'vue-json-editor'
import testConfigApi from '@/api/test-config/testConfigApi';
export default {
     // 注册组件
    components: { vueJsonEditor },
    data(){
        return{
           configList:[],    //  配置列表
           testConfigQuery:{  // config搜索对象

           },
           current:1,                  // 当前页
           size:10,                    // 数量
           total:0,                    // 总数
           dialogVisible:false,        // 弹框显示控制
           configData :{}              // 配置信息
        }
    },
    created(){
        this.getConfigListAndPage();   // 初始化环境
    },
    methods:{
        // 获取配置列表
        getConfigList:function(){
            testConfigApi.selectAllConfig().then(response=>{
                this.configList =  response.data.list
                console.log(this.configList)
            })
        },

        // 组合查询带分页
        getConfigListAndPage:function(){
            testConfigApi.selectQueryVoAndPage(this.current,this.size,this.testConfigQuery).then(response=>{
                this.total = response.data.total
                this.configList = response.data.list
            })
        },

        // 跳转添加配置页面
        gotoConfigAddPage:function(){
            this.$router.push({path:'/config-add'})
            // window.location.href = "/add"
        },

        // 删除配置数据
        deleteConfig:function(configId){
            this.$confirm('删除配置, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                testConfigApi.deleteTestConfig(configId).then(response=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getConfigListAndPage()
                }).catch(error=>{
                    this.$message.error("删除配置失败");
                    this.getConfigListAndPage()
                }) 
            })
    
        },

        // 重置配置查询对象
        resetting:function(){
            this.testConfigQuery = {}
            this.getConfigList()
        },

        // 显示弹框
        showConfigDataDialog:function(configData){
            this.dialogVisible = true
            this.configData = configData
        },

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
    width: 480px;
  }
</style>