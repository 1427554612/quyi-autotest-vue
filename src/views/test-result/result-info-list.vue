<template>
    <div>
        <el-card class="box-card" style="width:98%;margin-left: 15px;margin-top: 10px;height: 890px;">
            <div slot="header" class="clearfix">
                <span style="font-size:20px;font-weight: bolder;">结果详情管理</span>
            </div>
            <div >
                <splitpanes class="default-theme" @resize="paneSize = $event[0].size"  >
                    <pane :size="paneSize" min-size="20" sty>
                        <div id="left">
                            <el-card id="charts1-card" style="height:800px">
                                <div slot="header" class="clearfix">
                                    <span style="font-size:15px;font-weight: bolder;">结果详情列表</span>
                                </div>
                                <div style="width: 97%;margin-top: 0px;margin-left: 10px;">
                                    <div id="tags">
                                        <el-tag  type="" effect="dark" size="medium">执行总数：{{ total }}</el-tag>
                                        <el-tag  type="success" effect="dark" size="medium" style="margin-left:30px">成功总数：{{ successTotal }}</el-tag>
                                        <el-tag  type="danger" effect="dark" size="medium" style="margin-left:30px">失败总数：{{ errorTotal }}</el-tag>
                                        <el-tag  type="info" effect="dark" size="medium" style="margin-left:30px">总共运行时长：{{ runTime }} ms</el-tag>
                                        <el-tag  type="warning" effect="dark" size="medium" style="margin-left:30px">平均运行时长：{{ avgRunTime }} ms</el-tag>
                                    </div>
                                    <el-table :data="resultInfoList" border style="width: 100%;margin-top: 20px;" max-height="600"  >
                                        <el-table-column fixed prop="resultInfoId" label="结果详情id" width="200">
                                            <template slot-scope="scope" >
                                                <span style = "text-decoration: underline ; color :blue;" @click="setData(scope.row)">
                                                    {{ scope.row.resultInfoId }}
                                                </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="caseName" label="用例名称" width="200"></el-table-column>
                                        <el-table-column prop="runBeginTime" label="执行开始时间" width="200"></el-table-column>
                                        <el-table-column prop="runEndTime" label="执行结束时间" width="200"></el-table-column>
                                        <el-table-column prop="runTime" label="执行耗时(ms)" width="200"></el-table-column>
                                        <el-table-column prop="runResult" label="执行结果" width="120">
                                            <template slot-scope="scope" >
                                                <el-tag v-if="scope.row.runResult===true"  type="success" effect="dark">成功</el-tag>
                                                <el-tag v-if="scope.row.runResult===false"  type="danger" effect="dark">失败</el-tag>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="resultId" label="执行结果id" width="200"></el-table-column>
                                        <el-table-column prop="configId" label="执行配置id" width="200"></el-table-column>
                                        <el-table-column fixed="right" label="操作" width="100">
                                            <template slot-scope="scope">
                                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                                                <el-button type="text" size="small">编辑</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>

                                    <!-- 分页组件 --->
                                    <div id="page">
                                        <el-pagination background
                                            @size-change="callbackShowResultInfoList"
                                            @current-change="callbackShowResultInfoList"
                                            :current-page.sync="currentPage1"
                                            :page-size="size"
                                            layout="total, prev, pager, next"
                                            :total="total" 
                                            style="text-align:center;margin-top:20px">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </pane>
                    <pane :size="100 - paneSize" min-size="20">
                        <div id="rigth">
                            <div style="overflow:scroll;height:850px">
                                <el-collapse v-model="one_activeNames" @change="handleChange" style="width:95%;margin-left:20px">
                                    <el-collapse-item name="1" :title="resultInfoData.caseName"  style="box-shadow: 2px 2px 5px #bbb;padding-left: 10px;margin-top: 10px;"  >
                                        <el-collapse v-model="two_activeNames" @change="handleChange" style="width:95%;margin-left:20px">
                                            <el-collapse-item  title="请求数据"  style="box-shadow: 2px 2px 5px #bbb;padding-left: 10px;margin-top: 10px;">
                                                <el-tabs v-model="zzzz" @tab-click="handleClick"  type="border-card">
                                                    <el-tab-pane label="请求标头" name="first">
                                                        <H3>请求标头</H3>
                                                        <vue-json-editor :value="resultInfoData.datas.requestHeaders&&JSON.parse(resultInfoData.datas.requestHeaders)" :showBtns="false" :mode="'code'"
                                                            @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" style="width: 95%;"/>
                                                    </el-tab-pane>
                                                    <el-tab-pane label="请求正文" name="second">
                                                        <H3>请求参数</H3>
                                                        <vue-json-editor :value="resultInfoData.datas.requestBody && JSON.parse(resultInfoData.datas.requestBody)" :showBtns="false" :mode="'code'"
                                                            @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" style="width: 95%;"/>
                                                    </el-tab-pane>
                                                </el-tabs>
                                            </el-collapse-item>
                                            <el-collapse-item title="响应数据"  style="box-shadow: 2px 2px 5px #bbb;padding-left: 10px;margin-top: 10px;">
                                                <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                                                    <el-tab-pane label="响应标头" name="one">
                                                        <H3>响应标头</H3>
                                                        <vue-json-editor :value="resultInfoData.resultData && resultInfoData.resultData.responseHeader" :showBtns="false" :mode="'code'"
                                                            @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" style="width: 95%;"/>
                                                    </el-tab-pane>
                                                    <el-tab-pane label="响应正文" name="two">
                                                        <H3>响应正文</H3>
                                                        <vue-json-editor :value="resultInfoData.resultData && resultInfoData.resultData.responseBody" :showBtns="false" :mode="'code'"
                                                            @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" style="width: 95%;"/>
                                                    </el-tab-pane>
                                                    <el-tab-pane label="执行日志" name="three" >
                                                        <H3>执行日志</H3>
                                                            <quill-editor class="editor" ref="myTextEditor" v-model="resultInfoData.resultLog" :options="editorOption" 
                                                                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" @change="onEditorChange($event)">
                                                        </quill-editor>
                                                    </el-tab-pane>
                                                </el-tabs>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </el-collapse-item>
                                </el-collapse>
                            </div>
                        </div>
                    </pane>
                </splitpanes>
            </div>
        </el-card>
    </div>

</template>


<script>
// In your Vue component.
import { Splitpanes,Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import * as echarts from 'echarts';
import vueJsonEditor from 'vue-json-editor'
import testResultApi from '@/api/test-result/testResultApi';

export default {
  components: { Splitpanes:Splitpanes, Pane:Pane,vueJsonEditor:vueJsonEditor },
  data(){
    return{
        resultId :"",
        paneSize:50,
        resultInfoList:[],
        current:1,
        size:10,
        total:0,
        successTotal:0,
        errorTotal:0,
        runTime:0,
        avgRunTime:0,
        one_activeNames:['1'],
        resultInfoData:{
            caseName:"",
            datas:{}
        }
    }
  },
  watch:{
    $route(to,from){
        console.log("to = " + to)
        console.log("from = " + from)
        this.initResultInfoList()
    }
  },
  created(){
    this.initResultInfoList();
  },
  methods: {
    resize() {},

    // 初始化结果列表
    initResultInfoList(){
        console.log(this.$route.params)
        if(this.$route.params&&this.$route.params.result_id) {
            this.resultId = this.$route.params.result_id
            // 调用回显 
            this.callbackShowResultInfoList(1)
        }else{
            this.resultInfoList = []
        }
    },

    // 回显结果列表
    async callbackShowResultInfoList(current){
        this.avgRunTime = 0 
        this.runTime = 0 
        this.current = current
        await testResultApi.findAllResultInfo(this.resultId,this.current,this.size).then(response=>{
            this.resultInfoList = response.data.list;
            this.total = response.data.total
            // TODO:获取成功总数和失败总数
            testResultApi.findById(this.resultId).then(response=>{
                this.successTotal = response.data.data.runSuccessNum
                this.errorTotal = response.data.data.runErrorNum
            })
            // TODO:获取总共运行时长和平均运行时长
            testResultApi.findResultInfoList(this.resultId,1).then(response=>{
                response.data.list.forEach((item)=>{
                    this.runTime+=item.runTime
                })
                this.avgRunTime = (this.runTime / response.data.list.length).toFixed(2)
            }) 
        })
    },

    // 点击结果详情id,设置当前数据
    setData(data){
        this.resultInfoData = data
        console.log(this.resultInfoData)
    }

  }
};
</script>

<style scoped>
.splitpanes.default-theme .splitpanes__pane {
    /* background-color: #f2f2f2; */
}

.splitpanes.default-theme .splitpanes__pane {
    /* background-color: #f2f2f2; */
}

#textarea{
    height: 300px;
}
</style>


