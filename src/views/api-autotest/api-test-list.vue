<template>

    <el-card class="box-card" style="width:98%;margin-left: 15px;margin-top: 10px;">
        <div slot="header" class="clearfix">
            <span><b>测试用例列表</b></span>
        </div>

        <div id="config-query">
            <!-- 搜索项表单 -->
            <el-form :inline="true" class="demo-form-inline" style="margin-left: 20px" v-model="apiTestCaseQuery" >
                <el-form-item label="用例名称" >
                    <el-input v-model="apiTestCaseQuery.caseName" placeholder="用例名称"></el-input>
                </el-form-item>
                <el-form-item label="用例标题" >
                    <el-input v-model="apiTestCaseQuery.caseTitle" placeholder="用例标题"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" >
                    <el-select v-model="apiTestCaseQuery.requestMethod" placeholder="请求方式">
                        <el-option label="get" value="get"></el-option>
                        <el-option label="post" value="post"></el-option>
                        <el-option label="delete" value="delete"></el-option>
                        <el-option label="put" value="put"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item style="margin-left: 10px;">
                    <el-button @click="filterCaseList()">查询</el-button>
                    <el-button @click="resetting()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 用例列表 --->
        <div id="case-list">
            <!-- 上传组件 -->
            <div>
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    id="1"
                    action=""
                    :limit="1"
                    accept=".xls, .xlsx"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :http-request="handleUpload"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    :auto-upload="false">

                    <el-button style="margin;" slot="trigger"  type="primary">选取文件</el-button>
                    <el-button style="margin-left: 20px; "  type="success" @click="submitUpload">上传文件</el-button>
                    <el-button style="float:right;margin-right: 5px"  type="success" icon="el-icon-caret-right" @click="openConfigDiglog(selectCaseList)">批量执行</el-button>
                    <el-button style="float:right;"  type="primary" @click="gotoEditCase()">编辑用例</el-button>
                    <el-button style="float:right;"  type="success" @click="downloadCaseFile" >下载测试用例</el-button>
                </el-upload>
            </div>     
            <div style="margin-top: 20px;">
                <span><b>用例列表</b></span>      
            </div> 
            <div style="margin-top:10px">
                <el-tag type="warning" style="font-size:15px">用例总数: {{ apiCaseList.length }}</el-tag>
                <el-tag type="danger" style="font-size:15px;margin-left: 20px;">已勾选用例数: {{ selectCaseList.length }}</el-tag>
            </div>
            
            <el-table :header-cell-style="{'text-align':'center'}"  :data="apiCaseList" border max-height="600" style="width: 100%;margin-top: 10px;" @selection-change="caseTablehandleSelectionChange">
                <el-table-column type="selection" width="" fixed ref="selectCases"> </el-table-column>
                <el-table-column prop="caseNumber" label="用例编号" width="80" align=center></el-table-column>
                <el-table-column prop="caseName" label="用例名称" width="260" align=center></el-table-column>
                <el-table-column prop="caseTitle" label="用例标题" width="180" style="" align=center></el-table-column>
                <el-table-column prop="apiPath" label="请求地址" width="220" style="" align=center></el-table-column>
                <el-table-column prop="requestMethod" label="请求方式" width="120" style="" align=center>
                    <template scope="scope">
                        <el-tag type="success" style="font-size:15px;" v-if="scope.row.requestMethod === 'get'">{{ scope.row.requestMethod }}</el-tag>
                        <el-tag style="font-size:15px;" v-if="scope.row.requestMethod === 'post'">{{ scope.row.requestMethod }}</el-tag>
                        <el-tag type="warning" style="font-size:15px;" v-if="scope.row.requestMethod === 'put'">{{ scope.row.requestMethod }}</el-tag>
                        <el-tag type="danger" style="font-size:15px;" v-if="scope.row.requestMethod === 'delete'">{{ scope.row.requestMethod }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="isMainProcessApi" label="主流程用例" width="120" style="" align=center>
                    <template scope="scope">
                        <el-tag type="success" style="font-size:15px" v-if="scope.row.isMainProcessApi === '是'">{{ scope.row.isMainProcessApi }}</el-tag>
                        <el-tag type="warning" style="font-size:15px" v-if="scope.row.isMainProcessApi === '否'">{{ scope.row.isMainProcessApi }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="requestHeaders" label="请求头列表" width="180" style="" align=center>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="showConfigDataDialog(scope.row.requestHeaders,'请求头信息')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="requestBody" label="请求体" width="180" style="" align=center>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-zoom-in" v-if="scope.row.requestMethod === 'post' || scope.row.requestMethod === 'delete'" @click="showConfigDataDialog(scope.row.requestBody,'请求体信息')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="beforeScript" label="前置脚本" width="180" style="" align=center>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="openScriptDialog('info',scope.row.caseNumber,scope.row.beforeScript)">查看</el-button>
                        <el-button type="info" size="mini" icon="el-icon-edit" @click="openScriptDialog('before',scope.row.caseNumber,scope.row.beforeScript)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="afterScript" label="后置脚本" width="180" style="" align=center>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="openScriptDialog('info',scope.row.caseNumber,scope.row.afterScript)">查看</el-button>
                        <el-button type="info" size="mini" icon="el-icon-edit" @click="openScriptDialog('after',scope.row.caseNumber,scope.row.afterScript)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="isRun" label="是否执行" width="120" align=center>
                    <template scope="scope">
                        <el-tag type="success" style="font-size:15px" v-if="scope.row.isRun === '是'">{{ scope.row.isRun }}</el-tag>
                        <el-tag type="warning" style="font-size:15px" v-if="scope.row.isRun === '否'">{{ scope.row.isRun }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="assertMap" label="断言信息" width="180" align=center>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="showConfigDataDialog(scope.row.assertMap,'断言信息')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="isParams" label="是否参数化" width="120" align=center>
                    <template scope="scope">
                        <el-tag type="success" style="font-size:15px" v-if="scope.row.isParams === '是'">{{ scope.row.isParams }}</el-tag>
                        <el-tag type="warning" style="font-size:15px" v-if="scope.row.isParams === '否'">{{ scope.row.isParams }}</el-tag>
                    </template>
                </el-table-column>
                <!--  showConfigDataDialog(scope.row.params,'参数化信息' -->
                <el-table-column prop="paramList" label="参数数据" width="180" align=center>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-zoom-in" @click="showConfigDataDialog(scope.row.paramList,'参数化信息')">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right"  label="操作" align=center width="300">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" icon="el-icon-caret-right" @click="openConfigDiglog(scope.row)">执行</el-button>
                        <router-link :to="'/api/apiTestcaseInfo/'+scope.row.caseNumber">
                            <el-button type="info" size="mini" icon="el-icon-edit" style="margin-left: 15px">编辑</el-button>
                        </router-link>
                        <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-left: 15px" @click="deleteConfig(scope.row.caseNumber)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <!--左侧抽屉 -->
        <el-drawer :visible.sync="drawerIsView" direction="rtl" :before-close="handleClose" title="运行监控" modal="true" size="50%">
            <el-card class="drawer-card" style="width:98%;margin-left: 5px;">
                <div>
                    <el-collapse v-model="activeNames" @change="handleChange" accordion>
                        <el-collapse-item  name="1" >
                            <template slot="title">
                                <span style="font-size:larger;font-weight: 700;color:blue;">执行监控：</span><i class="header-icon el-icon-info" style="font-size: 18px;"></i>
                            </template>
                            <el-form ref="form11" :model="socketData" label-width="80px" id="table" >
                                <el-input type="textarea" v-model="socketData" id="textarea"></el-input>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>  
                </div>
            </el-card>
        </el-drawer>


        <!-- 用例数据弹框 -->
        <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" >
            <div style="width: 80%;height: 50%; margin-left: 100px;margin-top: 10px;">
                <vue-json-editor v-model="caseData" :showBtns="false" :mode="'code'"
                    @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
            </div>
            <span slot="footer" class="dialog-footer" style="margin-top:30px">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 关联配置弹框 -->
        <el-dialog title="全局配置" :visible.sync="configdialogVisible" width="50%"  :before-close="handleClose" >
            <div style="width: 80%;height: 50%; margin-left: 100px;margin-top: 10px;">
                <el-table  :data="testConfigList" style="width: 100%" border="true" height="300" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="configId" label="配置id" width="250"></el-table-column>
                    <el-table-column prop="configName" label="配置名称" width="250"></el-table-column>
                    <el-table-column prop="configType" label="配置类型"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer" style="margin-top:30px">
                <el-button @click="configdialogVisible = false">取 消</el-button>
                <el-button type="success" icon="el-icon-caret-right" @click="runApiCase" :disabled="association" >执行</el-button>
            </span>
        </el-dialog>

         <!--java脚本抽屉 -->
         <el-drawer :visible.sync="scriptVisible" direction="rtl" :before-close="handleClose" :title="dialogTitle" modal="true" size="60%">
            <div >
                <span slot="footer" class="dialog-footer" style="margin-left: 80%;">
                    <el-button @click="configdialogVisible = false" v-if="scriptSaveButtonVisble">取 消</el-button>
                    <el-button type="success" icon="el-icon-caret-right" @click="saveScript(code)" v-if="scriptSaveButtonVisble">保存</el-button>
                </span>
            </div>
            <div id="codeEditor" style="width:98%;margin-top: 20px;margin-left: 10px;">
                <codemirror 
                    ref="cmEditor"
                    :value="finalCode"
                    :options="cmOptions"
                    @update="codeUpdate"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange" />
            </div>
        </el-drawer>
        
    </el-card>

</template>
<script>
import vueJsonEditor from 'vue-json-editor'
import apiTestApi from '@/api/api-autotest/apiTestApi'
import testConfigApi  from '@/api/test-config/testConfigApi'
import axios from 'axios'
import SocketService from '@/utils/websocket'
import { codemirror } from 'vue-codemirror'
// import base style
import 'codemirror/lib/codemirror.css'
// import 'codemirror/mode/python/python.js'
require("codemirror/mode/clike/clike.js");
import 'codemirror/theme/darcula.css'
// 代码提示功能 具体语言可以从 codemirror/addon/hint/ 下引入多个
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
export default {
    name: "codemirrorDemo",
    components:{
        vueJsonEditor:vueJsonEditor,
        codemirror:codemirror
    },
    data(){
        return {
            BASE_URL:process.env.VUE_APP_BASE_API,
            apiTestCaseQuery:{              // 测试用例查询对象
            
            },
            fileList:[],                    // 待上传文件列表
            uploadFlag: false,
            fullscreenLoading: false,
            caseData:{},
            dialogVisible:false,            // 用例信息弹框
            configdialogVisible:false,      // 配置信息弹框
            scriptVisible:false,            // 脚本编辑弹框
            scriptSaveButtonVisble:false,   // 保存脚本按钮
            dialogName:"",
            apiCaseList:[],                 // 测试用例列表
            testConfigList:[],              // 测试配置列表
            selectCaseList:[],              // 选中用例列表
            selectTestConfigId:"",          // 当前选中配置id
            association:true,                // 关联按钮禁用、true：禁用、false：启用
            socketData:"",
            drawerIsView:false,               // 抽屉是否打卡
            
            // 脚本处理 
            beforeScript: "",                         // 前置脚本
            afterScript:"",                           // 后置脚本
            finalCode:"",                             // 最终脚本
            selectCode:"",                          // 选中前还是后
            caseNumber:0,                           // 当前编号
            dialogTitle:"",                   
            themes:['darcula','dracula','eclipse','erlang-dark','idea','liquibyte','mbo'],
            cmOptions: {
                tabSize: 4,            // table表格键空格数
                mode: 'text/x-java',        // 编辑语言
                theme: 'darcula',      // 主题样式
                lineNumbers: true,     // 显示行号
                line: true,
                smartIndent: true,     // 智能缩进
                indentUnit: 4,         // 智能缩进单位为4个空格长度
                keymap: "sublime",     // 快键键风格
                styleActiveLine: true, // 高亮选中行
                readOnly:false,        // 只读模式
                extraKeys: {"Ctrl": "autocomplete"}
            }

        }
    },
    watch:{
        caseNumber(newV,oldV){
            window.alert(oldV + " -->" + newV)
        }
    },
    mounted(){  
        this.ws = SocketService.Instance;  // 挂载组件时创建socket连接
        this.ws.send({id:"9527",message:new Date().toLocaleDateString() + ' 用户9527，成功连接服务器...'},this.Callback,this.dealData)

    },
    // 销毁
    destroyed() {
        this.ws.unSubscribe(); // 销毁ws 连接
    },
    
            
    created(){
        this.selectAllApiTestCase()
    },
    methods:{

        // 查询所有接口测试用例
        selectAllApiTestCase:function(){
            apiTestApi.selectAllCase().then(response=>{
                this.apiCaseList = response.data.list
            })
        },

        onCmReady(cm) {
            console.log('the editor is readied!', cm)
        },
        onCmFocus(cm) {
            console.log('the editor is focused!', cm)
        },
        onCmCodeChange(newCode) {
            console.log('this is new code', newCode)
            this.code = newCode
        },

        codeUpdate(){

        },

        // 脚本编辑
        openScriptDialog:function(str,caseNumber,code){
            // 回显数据
            this.finalCode = code;
            // 前置脚本
            if(str === 'before'){
                this.dialogTitle = "前置脚本处理"
                this.caseNumber = caseNumber;
                this.selectCode = str;
                this.scriptSaveButtonVisble = true;
                this.scriptVisible = true;
            }
            // 后置脚本
            else if(str == 'after'){
                this.dialogTitle = "后置脚本处理"
                this.caseNumber = caseNumber;
                this.selectCode = str;
                this.scriptSaveButtonVisble = true;
                this.scriptVisible = true;
            }else{
                this.dialogTitle = "查看"
                this.caseNumber = caseNumber;
                this.selectCode = str;
                this.scriptVisible = true;
                this.scriptSaveButtonVisble = false
            }
        },
        
        // 保存脚本
       async saveScript(code){
            if(this.selectCode == 'before'){
                this.beforeScript = code;
                this.finalCode = this.beforeScript;
            }else{
                this.afterScript = code;
                this.finalCode = this.afterScript;
            }
            console.log("final code = " + this.finalCode)
            let index = 0;   // 下标
            this.apiCaseList.forEach((element,i) => {
                if(element.caseNumber === this.caseNumber){
                    index= i;
                    console.log("选中的列表元素位置是：" + index)
                    element.beforeScript = this.beforeScript;
                    element.afterScript = this.afterScript;
                    console.log("--------------------")
                    console.log(this.apiCaseList[index])
                }
            });
            await apiTestApi.editAllCase(this.apiCaseList).then(response=>{
                // 批量执行
                this.$message({
                    type:"success",
                    message:"脚本编辑成功！"
                })
                // this.$router.go(0);
                location.reload()
            
            })

        },

        // 脚本变更
        onCmCodeChange(code){
            console.log(code)
            this.code = code
        },




        // 显示Json详细数据模态框
        showConfigDataDialog:function(caseData,dialogName){
            this.dialogName = dialogName
            console.log("-----------------------------------------")
            this.caseData = JSON.parse(caseData)
            this.dialogVisible = true
        },

        // 关联测试配置弹框
        openConfigDiglog:function(runCaseInfo){
            console.log("=========================")
            if(runCaseInfo instanceof Array){
                this.selectCaseList = runCaseInfo
            }
            else{
                this.selectCaseList.push(runCaseInfo)
                if(this.selectCaseList.length===0){
                    this.$message.error("至少需要勾选一条用例....")
                    return
                }
            }
            this.selectAllConfig()
            this.configdialogVisible = true
        },
        
        // 查询所有配置信息
        selectAllConfig:function(){
            testConfigApi.selectAllConfig().then(response=>{
                this.testConfigList = response.data.list
            })
        },
        // 用例表格多选框改变后
        caseTablehandleSelectionChange:function(selectList){
            this.selectCaseList = []
            console.log(selectList)
            for(let i = 0; i< selectList.length;++i){
                this.selectCaseList.push(selectList[i])
            }
        },

        // 当绑定配置多选框改变后
        handleSelectionChange:function(selectList){
            console.log("--------------------------")
            console.log( selectList)
            if(selectList.length==1){
               this.selectTestConfigId = selectList[0].configId
               console.log(this.selectTestConfigId)
               this.association = false
            }else{
                this.$message.error("需要且只能勾选一条配置...")
                this.association = true
            }
        },
        // 回调函数
        dealData(e){
            console.log("推送数据为： " + e)
            this.socketData+=e+"\n"
        },
        // 执行接口用例
       async runApiCase(){
            this.socketData = ""   // 清空通信数据
            this.drawerIsView = true
            // 批量执行
            this.$message({
                    type:"success",
                    message:"开始执行用例......"
                })
                apiTestApi.selectRunCase(this.selectCaseList,this.selectTestConfigId).then(response=>{
                    this.$notify({
                        title: '成功',
                        message: '执行完毕...',
                        type: 'success'
                    });
                    this.selectCaseList = []
                    this.downloadReport()
                })
            this.configdialogVisible = false
            this.selectTestConfigId = ""
            await this.selectAllApiTestCase()
            
        },
        // 下载功能
        downloadReport() {
            axios({
                url: this.BASE_URL + `/api/api-autotest/download/report`,
                method: 'GET',
                responseType: 'blob'
            }).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', response.headers.filename);
                document.body.appendChild(link);
                link.click();
            })
        },

        // 下载测试用例文件
        downloadCaseFile:function(){
            axios({
                url: this.BASE_URL + `/api/api-autotest/download/file`,
                method: 'GET',
                responseType: 'blob'
            }).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', response.headers.filename);
                document.body.appendChild(link);
                link.click();
            })
        },
    

        // 搜索过滤测试列表
        filterCaseList:function(){
            let resultApiList = this.apiCaseList
            console.log("filterCaseList is run")
            let keys = Object.keys(this.apiTestCaseQuery)
            for(let i = 0;i<keys.length;++i){
                if(this.apiTestCaseQuery[keys[i]]!=="" || this.apiTestCaseQuery[keys[i]]!==null || this.apiTestCaseQuery[keys[i]]!=undefined)  resultApiList = this.filterData(resultApiList,keys[i],this.apiTestCaseQuery[keys[i]])
            }
            console.log("final = " + resultApiList)
            this.apiCaseList = resultApiList
        },
        
        // 过滤出指定数据
        filterData:function(list,key,value){
            console.log(list)
            console.log(key)
            console.log(value)
            let resultList = []
            for(let i = 0;i<list.length;++i){
                if(list[i][key] === value) resultList.push((list[i]))
            }
            console.log("result:" +resultList)
            return resultList
        },
        
        // 重置搜索框
        resetting:function(){
            this.apiTestCaseQuery = {}
            this.selectAllApiTestCase()
        },
        submitUpload() {
                if(! this.uploadFlag){
                    this.$message.error("请先选择文件！");
                } else{
                    this.$refs.upload.submit();
                }
            },
        handleRemove(file, fileList) {
            this.uploadFlag = false
        },
        handleChange(file, fileLists){
        const isLt5M = file.size / 1024 / 1024 < 20;  //不能超过20M
            // const isPNG = file.type === 'image/png';
            // const isJPG = file.type === 'image/jpeg';
            // const isPDF = file.type === 'application/pdf';
            // const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            // const isDOC = file.type === 'application/msword';
            const isXLSX = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const isXLS = file.raw.type === 'application/vnd.ms-excel';
            const fileFormat = (isXLSX || isXLS);
            if (!isLt5M) {
                this.$message.error('上传文件大小不能超过 20MB!');
                this.fileList = []
            }
            if (!fileFormat) {
                this.$message.error('上传格式不支持！格式仅支持：XLS、XLSX');
                this.fileList = []
            }
            this.uploadFlag = true
            return isLt5M && fileFormat;
        },
        
        //
        handleUpload(file) {
            let formData = new FormData()
            console.log(file)
            formData.append("fileName",file.file)
            apiTestApi.fileUpload(formData).then(response=>{
                this.$message({
                    type:"success",
                    message:"上传成功"
                })
            })
        },

        handleExceed(files, fileList) {
            // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            this.$message.warning(`当前限制选择 1 个文件！`);
        },

        // ---------------------------------------------------------------------------------------------------
        // 跳转添加页面
        gotoEditCase(){
            this.$router.push({path:'/api-test-edit'})
        }


    }
}
</script>

<style >
.el-dialog{
    height: 500px;
}
.jsoneditor-vue { height: 300px; }
#textarea{
    height: 800px;
}
#el-collapse-head-2999{
    font-size:larger;
    font-weight:700
}

.CodeMirror{
    height: 800px;
}
</style>