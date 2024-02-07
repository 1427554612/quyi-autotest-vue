<template>
  <div class="app-container">
    <el-card class="box-card"  id="main-card">
            <!-- 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" :disabled="disabled">
      <!-- 基础接口配置 -->
      <el-tab-pane label="接口配置" name="save-base-api">接口配置
              <!-- 表单 -->
        <el-form ref="form" :model="testcase" label-width="80px" style="margin-top:50px;width: 98%" :rules="validator">
          <el-form-item label="用例名称" prop="caseName">
            <el-input v-model="testcase.caseName" ></el-input>
          </el-form-item>

          <el-form :inline="true" :model="formInline" class="demo-form-inline" style="margin-left:10px">
          <el-form-item label="用例类型" >
            <el-select v-model="testcase.caseType" placeholder="请选择用例类型">
              <el-option label="正常用例" value="正常用例"></el-option>
              <el-option label="异常用例" value="异常用例"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目">
              <el-select v-model="testcase.projectId" placeholder="请选择所属项目">
                  <el-option v-for=" project in returnProjectList" :label="project.projectName" :key="project.projectId" :value="project.projectId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境地址" >
              <el-select v-model="testcase.addressId" placeholder="请选择测试地址" style="width:300px"> 
                  <el-option v-for=" ip in returnAddressIpList" :label="ip.addressName +':' + ip.ip" :key="ip.addressId" :value="ip.addressId"></el-option>
                </el-select>
          </el-form-item>
          </el-form>

          <el-form-item label="请求地址" prop="requestPath">
            <el-input v-model="testcase.requestPath"></el-input>
          </el-form-item>

          <el-form :inline="true" :model="formInline" class="demo-form-inline" style="margin-left:10px">
              <el-form-item label="请求方式">
                <el-select v-model="testcase.requestType" placeholder="请选择请求方式">
                  <el-option label="get" value="get"></el-option>
                  <el-option label="post" value="post"></el-option>
                  <el-option label="put" value="put"></el-option>
                  <el-option label="delete" value="delete"></el-option>
                </el-select>
              </el-form-item>

              <!-- 选择参数传递方式 -->
              <el-form-item label="参数类型">
                <el-select v-model="testcase.dataType" placeholder="请选择参数方式" @change="setDataType">
                  <el-option v-for="data in dataTypeList" :label="data" :value="data" :key="data"></el-option>
                </el-select>
              </el-form-item>

          </el-form>

          <!-- 请求参数配置 -->
          <!-- json参数 -->
          <div style="width: 90%;margin-top: 10px;font-size:15px;margin-left:50px" v-if="!applicationJsonDisplay">
            <el-button @click="efficacyJson" type="primary" plain>校验Json</el-button>
            <b-code-editor 
              v-model="testcase.requestData" 
             :smart-indent="true" theme="dracula"  :line-wrap="false" ref="editor" style="margin-top: 10px;">
            </b-code-editor>
            
            <br>
          </div>

          <!-- url params参数 -->
          <div style="margin-top: 30px;" v-bind:hidden="paramsDisplay">
            <el-button type="primary" @click="addUrlParams">urlParams</el-button>
              <el-table v-bind:data="testcase.requestData" border style="width: 100%;margin-top:10px" >
              <el-table-column prop="key" label="key" width="520px">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.key" :fetch-suggestions="queryHeaderKey" placeholder="请输入参数key"  style="width:490px" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column prop="value" label="value" width="960px">
                   <template slot-scope="scope">
                    <el-input v-model="scope.row.value" :fetch-suggestions="queryHeader" placeholder="请输入参数value"  popper-append-to-body="false" style="width:940px" ></el-input>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="165px" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>


          <!-- multipart/form-data参数 -->
          <div style="margin-top: 30px;" v-bind:hidden="multipartformdataDisplay">
            <el-button type="primary" @click="addFormDatas">multipart/form-data</el-button>
              <el-table v-bind:data="formDatas" border style="width: 100%;margin-top:10px" >
              <el-table-column prop="key" label="key" width="520px">
                  <template slot-scope="scope">
                    <el-form :inline="true" class="demo-form-inline">
                      <el-input v-model="scope.row.key"  placeholder="请输入参数key"  style="width:280px" ></el-input>
                      <el-select v-model="scope.row.formDataType" placeholder="data" style="width:100px" @change="settingFileOrText(scope.$index,$event)">
                          <el-option label="text" value="text" key="1"></el-option>
                          <el-option label="file" value="file" key="2"></el-option>
                      </el-select>
                    </el-form>
                  </template>
              </el-table-column>
              <el-table-column prop="value" label="value" width="960px">
                   <template slot-scope="scope">
                    <el-input v-if="inputTextDisplay[scope.$index]" v-model="scope.row.value"  placeholder="请输入参数value"  popper-append-to-body="false" style="width:940px" />
                    <input v-if="inputFileDisplay[scope.$index]" type="file"  placeholder="请选择文件" ref="fileUpload" enctype="multipart/form-data" accept=".*" @change="selectFile(scope.$index)" />
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="165px" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteFormDatas(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>


          <!-- 请求头配置 -->
          <div style="margin-top: 30px;">
            <el-button type="primary" @click="addHeader">添加请求头</el-button>
              <el-table v-bind:data="testcase.requestHeaders" border style="width: 100%;margin-top:10px" >
                <el-table-column prop="headerKeyName" label="请求头参数" width="520px">
                    <template slot-scope="scope">
                      <el-autocomplete v-model="scope.row.headerKeyName" :fetch-suggestions="queryHeaderKey" placeholder="请输入请求头" @select="(item)=>handleSelectHeaderKey(item.headerKeyId)" style="width:490px"  ></el-autocomplete>
                    </template>
                </el-table-column>

                <el-table-column prop="headerValueName" label="请求头值" width="960px">
                    <template slot-scope="scope">
                      <el-autocomplete v-model="scope.row.headerValueName"  :fetch-suggestions="queryHeaderValue" placeholder="请输入内容" @select="(item)=>handleSelectHeaderValue(item.headerValueId)" popper-append-to-body="false" style="width:940px" ></el-autocomplete>
                    </template>
                </el-table-column>
                <el-table-colum prop="headerValueId">
                  <el-input v-model="headerValueId"></el-input>
                </el-table-colum>
                <el-table-column label="操作" width="165px" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" icon="el-icon-delete"  @click="deleteHeaderRow(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
          </div>

          <el-form-item style="margin-top:20px" align="center">
            <el-button type="primary" @click="nextToParamsStag">下一步</el-button>
            <el-button>取消</el-button>
          </el-form-item>
      </el-form>
      <!-- 设置参数标签页 -->
      </el-tab-pane>

      <el-tab-pane label="参数化配置" name="goto-params-active" :disabled = "disabled">
          参数化配置
          <!-- 参数化配置 -->
          <div style="margin-top: 30px;" >
            <el-button type="primary" @click="addTestParams">添加参数</el-button>
              <el-table v-bind:data="testcase.testParams" border style="width: 100%;margin-top:10px" >
              <el-table-column prop="paramsName" label="变量名称" width="500px">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.paramName" placeholder="请输入变量名称" @select="handleSelect" style="width:450px" ></el-input>
                  </template>
              </el-table-column>

              <el-table-column prop="paramsValue" label="变量取值" width="500px">
                   <template slot-scope="scope">
                    <el-input v-model="scope.row.paramValue"  :fetch-suggestions="queryHeader" placeholder="请输入参数的值" @select="handleSelect" popper-append-to-body="false" style="width:450px" ></el-input>
                  </template>
              </el-table-column>

              <el-table-column prop="paramsFrom" label="参数来源" width="500px">
                <template slot-scope="scope">
                   <el-select v-model="scope.row.paramFrom" placeholder="请选择参数来源">
                    <el-option label="响应头" value="responseHeader"></el-option>
                    <el-option label="响应正文" value="responseBody"></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="165px" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTestParams(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          
          <!-- 断言配置 -->
          <div style="margin-top: 30px;" >
            断言配置<br/>
            <el-button type="primary" @click="addTestAssert" style="margin-top: 30px;">添加断言</el-button>
              <el-table v-bind:data="testcase.testAsserts" border style="width: 100%;margin-top:10px" >
              <el-table-column prop="assertKey" label="断言字段" width="500px">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.assertKey" placeholder="请输入做断言的字段" @select="handleSelect" style="width:450px" ></el-input>
                  </template>
              </el-table-column>

              <el-table-column prop="assertValue" label="断言的预期值" width="500px">
                   <template slot-scope="scope">
                    <el-input v-model="scope.row.assertValue" :fetch-suggestions="queryHeader" placeholder="断言的预期值" @select="handleSelect" popper-append-to-body="false" style="width:450px" ></el-input>
                  </template>
              </el-table-column>

              <el-table-column prop="assertType" label="断言方式" width="500px">
                <template slot-scope="scope">
                   <el-select v-model="scope.row.assertType" placeholder="请选择断言方式">
                    <el-option label="等于" value="equel"></el-option>
                    <el-option label="不等于" value="notEquel"></el-option>
                    <el-option label="包含" value="contain"></el-option>
                    <el-option label="不等于" value="notContain"></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="165px" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTestAssert(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>


          <el-form>
              <el-form-item style="margin-top:20px" align="center">
                  <el-button type="primary" @click="confimAdd">下一步</el-button>
                  <el-button>取消</el-button>
              </el-form-item>
          </el-form>
          
      </el-tab-pane>
    </el-tabs>
    </el-card>
  
  </div>
</template>
<script>
// 导入模块
import testcaseApi from "@/api/api-autotest/testcaseApi"
import testAddressApi from "@/api/api-autotest/testAddressApi"
import testProjectApi from "@/api/api-autotest/testProjectApi"
import vueJsonEditor from 'vue-json-editor'
const formDataString = new FormData()    // 创建formData对象，用于封装String
const formDataFile = new FormData()    // 创建formData对象，用于封装File
  export default {
    // 注册组件
    data() {
      return {
        activeName: 'save-base-api',
        disabled:true,
        validator:{
          requestPath:[{ required: true, message: '必须输入请求地址', trigger: 'blur' }],
          caseName:[{ required: true, message: '必须输入用例名称', trigger: 'blur' }]
        },
        testcase:{
            caseName:"",
            caseType:"",
            requestPath:"",
            requestType:"",
            projectId:"",
            addressId:"",
            requestHeaders:[],
            testParams:[],
            testAsserts:[],
            dataType:"",               // 参数传递方式
            requestData:"",             // 请求传递的参数
            sortNumber:1
        },
        returnProjectList:[],         // 所属项目列表
        returnAddressIpList:[],       // ip地址列表       
        disabled:true,
        dataTypeList:["application/json","multipart/form-data","params" ],
        paramsDisplay:true,               // 控制params表单隐藏
        applicationJsonDisplay:true,      // 控制json编辑器隐藏
        multipartformdataDisplay:true,    // 控制multipart表单隐藏
        inputTextDisplay:[false],            // 控制multipart的input输入隐藏
        inputFileDisplay:[false],            // 控制multipart的file输入隐藏
        headerKeyId:"",
        headerKeyIds:[],
        headerValueId:"",
        headerValueIds:[],
        formDataType:"",                   // 传参方式是form-data的时候
        formDatas:[],
      };
    },
    created(){
      this.initGetProject()
      this.initGetAddress()
    },
    methods: {
      
      // 初始化-获取所有项目
      initGetProject:function(){
          testProjectApi.selectAllTestProject().then(response=>{
              this.returnProjectList = response.data.items
          })
      },
      // 初始化-获取所有ip地址
      initGetAddress:function(){
          testAddressApi.selectAllAddress().then(response=>{
            this.returnAddressIpList = response.data.items
          })
      },
      // 当选择地址后
      selectAddress:function(value){
          console.log("当前选择的value是" + value)
          this.testcase.addressId = value
      },
      
      // 查询已存在的header头信息的key
      queryHeaderKey:function(queryString,callback){
        if(queryString!=null&&queryString.length>1){
          let newItems = []
          testcaseApi.findHeaderKey(queryString).then(response=>{
            let items = response.data.items
            for (let index = 0; index < items.length; index++) {
                let obj = {value:items[index].headerKeyName,headerKeyId:items[index].headerKeyId}  // 返回结构必须有value属性才能渲染
                newItems[index] = obj
            }
            callback(newItems)
          })
        }
      },
      handleSelectHeaderKey:function(headerKeyId){
          this.headerKeyId = headerKeyId
          console.log("当前的headerKeyId = " + this.headerKeyId)
          this.headerKeyIds.push(this.headerKeyId)
          console.log(this.headerKeyIds)
      },
      handleSelectHeaderValue:function(headerValueId){
        this.headerValueId = headerValueId
        console.log("当前的headerValueId = " + this.headerValueId)
        this.headerValueIds.push(this.headerValueId)
        console.log(this.headerValueIds)
      },

      // 查询已存在的header头信息的value
      queryHeaderValue:function(queryString,callback){
        if(queryString!=null&&queryString.length>1){
          let newItems = []
          testcaseApi.findHeaderValue(queryString).then(response=>{
            let items = response.data.items
            for (let index = 0; index < items.length; index++) {
                let obj = {value:items[index].headerValueName,headerValueId:items[index].headerValueId}  // 返回结构必须有value属性才能渲染
                newItems[index] = obj
            }
            callback(newItems)
          })
        }
      },


      // 设置传参方式
      setDataType:function(value){
        this.testcase.dataType = value;
        console.log("参数传递的方式为：" + this.testcase.dataType)
        if(this.testcase.dataType === "application/json"){
          this.applicationJsonDisplay = false
          this.paramsDisplay = true
          this.multipartformdataDisplay = true
        }else if(this.testcase.dataType === "params"){
          this.applicationJsonDisplay = true
          this.paramsDisplay = false
          this.multipartformdataDisplay = true
           this.testcase.requestData = []
        }else{
          this.applicationJsonDisplay = true
          this.paramsDisplay = true
          this.multipartformdataDisplay = false
          // this.testcase.requestData = []     // 当传参方式是fromData的时候、初始化formDatas数组
          console.log(formData)
        }
      },

      // 设置multipar传参方式
      settingFileOrText:function(index,value){
        console.log("-------------------------------------------------------------")
        console.log(index)
        console.log("传参方式为：" + value)
        console.log(event)
        console.log(event.target) // 获取当前元素对象
          if(value==="text"){
            this.inputTextDisplay[index] = true
            this.inputFileDisplay[index] = false
          }else{
            this.inputTextDisplay[index] = false
            this.inputFileDisplay[index] = true
          }
      },

      // 添加multipar参数
      addFormDatas:function(){
        let newLine = {
            key:"",
            value:""
          }
        this.formDatas.push(newLine)
      },

      // 当选中的是文件的时候
      selectFile:function(index){
          this.formDatas[index].value = this.$refs.fileUpload.files[0]
      },

      // 将form-data数据解析为form-data对象,调用接口传递到服务器
      stringLoadingFormData:function(){
        console.log("formdata列表")
        console.log(this.formDatas)
          for (let index = 0; index < this.formDatas.length; index++) {
            if(typeof this.formDatas[index].value === "object"){
              formDataFile.append(this.formDatas[index].key,this.formDatas[index].value)     
            }else{
              formDataString.append(this.formDatas[index].key,this.formDatas[index].value)
            }    
          }
          if(formDataFile.keys()){
              testcaseApi.formDataFileName(formDataFile)
          }
          if(formDataString.keys()){
              testcaseApi.formDataStringName(formDataString)
          }
      },
      // 删除参数
      deleteFormDatas:function(index){
        this.formDatas.splice(index,1)
      },
      
      // 添加urlParams参数
      addUrlParams:function(){
          let newLine = {
            key:"",
            value:""
          }
        this.testcase.requestData.push(newLine)
      },
      // 添加请求头行
      addHeader:function(){
          let newLine = {
            headerKeyId:"",
            headerKeyName:"",
            headerValueId:"",
            headerValueName:""
          }
          this.testcase.requestHeaders.push(newLine)

      },
      // 删除请求头行
      deleteHeaderRow:function(index){
        console.log("删除的下标是：" + index)
        this.testcase.requestHeaders.splice(index,1)
      },

  
      // 检测json格式
      isJSON(str) {
        if (typeof str == 'string') {
          try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
              return true;
            }else{
              return false;
            }

          } catch(e) {
            return false;
          }
        }else if (typeof str == 'object'  && str) {
          return true;
        }
      },
      // 点击效验Json格式是否正确
      efficacyJson(){
        if (!this.isJSON(this.testcase.requestData)){
          this.$message.error(`json格式错误`)
          return false
        }
        this.$message.success('json格式正确')
        console.log("当前对象为：" + this.testcase.requestData)
      },

      // 进入下一页标签页
      nextToParamsStag(tab, event) {
        this.activeName =  "goto-params-active"
        console.log(this.testcase)
        for (let index = 0; index < this.testcase.requestHeaders.length; index++) {
          this.testcase.requestHeaders[index].headerKeyId = this.headerKeyIds[index]
          this.testcase.requestHeaders[index].headerValueId = this.headerValueIds[index]
        }
      },

      // 添加参数化行
      addTestParams:function(){
        let newParamLine = {
            paramName:"",
            paramValue:"",
            paramFrom:""
          }
        this.testcase.testParams.push(newParamLine)
      },
      // 删除参数化行
      deleteParams:function(index){
        console.log("删除行为：" + index)
        this.testcase.testParams.splice(index,1)
      },
      // 添加断言，暂时只支持1条断言
      addTestAssert:function(){
          if(this.testcase.testAsserts.length>0){
            this.$message.error("暂时只支持一条断言!")
            return
          }
          let newLine = {
            assertKey:"",
            assertValue:"",
            assertType:""
          }
          this.testcase.testAsserts.push(newLine)
      },
      // 删除断言
      deleteTestAssert:function(){
          this.testcae.testAsserts = []
      },

      // 初始化-获取测试用例的默认排序数,更改请求为同步
      async getCaseIndex(){
          await testcaseApi.selectTestCaseCount(this.testcase.projectId).then(response=>{
            console.log("添加后的排序为：" + this.testcase.sortNumber)  // 正确
            this.testcase.sortNumber = response.data.count+1
          })
      },

      // 确认添加,返回用例列表
      async confimAdd(){
        // 设置用例排序
        await this.getCaseIndex()
        // 当传参是文件类型
        if(this.testcase.dataType==="multipart/form-data"){
          this.stringLoadingFormData()
        }
        else{
          // 当传参不是文件类型，那么将请求参数转化为json字符串
        this.testcase.requestData = JSON.stringify(this.testcase.requestData)
        console.log("开始转换json")
        }
        
        await testcaseApi.addTestCase(this.testcase).then(response=>{
            this.$message.success("添加成功")
            console.log(this.testcase)
            this.$router.push({path:"/api/apiTestcaseList"})
          }).catch(error=>{
            this.$message.error("添加失败"+error)
          })
      }
    }
  };
</script>

<style scoped>
  .el-tab-pane{
    font-size: 25px;
    top:10px
  }
  .el-form{
    width: 80%;
  }

</style>

