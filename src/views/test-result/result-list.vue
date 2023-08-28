<template>
    <div>
        <el-card class="box-card"  id="main-card">
            <div slot="header" class="clearfix">
                <div slot="header" class="clearfix">
                    <span style="font-size:20px;font-weight: bolder;">结果管理</span>
                    <el-button type="danger" size="mini" icon="el-icon-delete"  style="margin-left:1400px" @click="removeAllResult">清空结果数据</el-button>
                </div>

                <!--统计图 -->
                <div style="float:left;width: 45%;;margin-top: 10px;">
                    <el-card id="charts1-card" style="height:900px">
                        <div id="charts1" style="width: 700px;height: 816px;float: left;"></div>
                    </el-card>
                </div>
                

                <div style="float:right;width: 54%;margin-top: 10px;">
                    <el-card style="height:900px">
                        <div id="queryForm">
                         <!-- 搜索项表单 -->
                        <el-form :inline="true" class="demo-form-inline" >
                            <el-form-item label="配置id" >
                                <el-input v-model="resultQueryVo.result_id" placeholder="结果id"></el-input>
                            </el-form-item>
                            <el-form-item label="配置名称" >
                                <el-input v-model="resultQueryVo.case_name" placeholder="用例名称"></el-input>
                            </el-form-item>
                            <el-form-item label="配置类型" >
                                <el-select v-model="resultQueryVo.resultType" placeholder="结果类型">
                                    <el-option label="api" value="api"></el-option>
                                    <el-option label="web-ui" value="post"></el-option>
                                    <el-option label="phone-ui" value="phone-ui"></el-option>
                                    <el-option label="performance" value="performance"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="margin-left: 10px;">
                                <el-button @click="findResult()">查询</el-button>
                                <el-button @click="resetting()">重置</el-button>
                                <el-tag  style="margin-left:250px;font-size:15px">当前执行总耗时（ms）: {{current_run_sum_time}}</el-tag>
                                <el-tag type="warning" style="margin-left:20px;font-size:15px">当前执行总数: {{total}}</el-tag>
                                <!-- <el-tag type="success" style="margin-left:20px"></el-tag>
                                <el-tag type="danger" style="margin-left:20px"></el-tag> -->
                            </el-form-item>
                        </el-form>
                    </div>
                        <div>
                            <el-table :data="resultList" style="width: 100%;margin-top: 10px;"  height="500" border  max-height="600">
                                <el-table-column fixed prop="resultId" label="结果id" width="180"> 
                                    <template slot-scope="scope" >
                                        <router-link :to="'/result-info-list/'+scope.row.resultId" style = "text-decoration: underline ; color :blue;">
                                            {{ scope.row.resultId }}
                                        </router-link>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="caseName" label="用例名称" width="200"> </el-table-column>
                                <el-table-column prop="caseTitle" label="用例标题" width="200">
                                    <template scope="scope">
                                        {{ scope.row.datas.caseTitle }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="configName" label="最近执行平台" width="200"></el-table-column>
                                <el-table-column prop="resultType" label="用例类型" width="100">
                                    <template scope="scope">
                                        <el-tag style="font-size:15px" v-if="scope.row.resultType==='api'">{{ scope.row.resultType }}</el-tag>
                                        <el-tag style="font-size:15px" type="success" v-if="scope.row.resultType==='web-ui'">{{ scope.row.resultType }}</el-tag>
                                        <el-tag style="font-size:15px" type="info" v-if="scope.row.resultType==='phone-ui'">{{ scope.row.resultType }}</el-tag>
                                        <el-tag style="font-size:15px" type="warning" v-if="scope.row.resultType==='performance'">{{ scope.row.resultType }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="runNum" label="执行总数" width="100"> </el-table-column>
                                <el-table-column prop="runSuccessNum" label="成功总数" width="100"> </el-table-column>
                                <el-table-column prop="runErrorNum" label="失败总数" width="100"> </el-table-column>
                                <el-table-column prop="runSuccessRate" label="执行成功率" width="100">
                                    <template slot-scope="scope">{{ scope.row.run_success_rate }}%</template>
                                </el-table-column>
                                <el-table-column prop="lastRunResult" label="最近执行结果" width="120"> 
                                    <template slot-scope="scope">
                                        <el-tag type="success" style="font-size:15px" v-if="scope.row.lastRunResult === true">成功</el-tag>
                                        <el-tag type="danger" style="font-size:15px" v-if="scope.row.lastRunResult === false">失败</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="lastRunDate" label="最近执行时间" width="180"> </el-table-column>
                                <el-table-column prop="lastRunTime" label="最近执行耗时(ms)" width="140"> </el-table-column>
                                <el-table-column prop="resultData" label="响应数据" width="180" style="" align=center>
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="mini" icon="" @click="showResponseDataDialog(scope.row.resultData)">查看</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div id="page" style="margin-top:50px">
                            <el-pagination
                                @size-change="findResult"
                                @current-change="findResult"
                                :current-page.sync="currentPage3"
                                :page-size="size"
                                layout="total, prev, pager, next"
                                :total="total" 
                                style="text-align:center">
                            </el-pagination>
                        </div>
                    </el-card>
                </div>
                <div style="width:1620px;float: left;margin-top: 20px;">
                    <el-card style="height: 300px;">
                        <div id="charts2" style="width: 700px;height: 250px;float: left;"></div>
                        <div id="charts3" style="width: 700px;height: 250px;float: left;margin-left: 20px;"></div>
                    </el-card>

                </div>
            </div>

            <!-- 响应正文弹框 -->
            <el-dialog title="接口响应" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" >
                <div style="width: 95%; margin-left: 20px;margin-top: 10px;">
                    <vue-json-editor v-model="responseData" :showBtns="false" :mode="'code'"
                        @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError"  style="padding"/>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import testResultApi from '@/api/test-result/testResultApi';
import * as echarts from 'echarts';
import chartsApi from '@/api/test-result/chartsApi';
import vueJsonEditor from 'vue-json-editor'

export default{
    components:{
        vueJsonEditor:vueJsonEditor
    },
    data(){
        return {
            resultQueryVo:{
                resultId:"",
                resultType:"",
                caseName:""
            },
            current:1,
            size:10,
            total:0,
            resultList:[],
            charts1:{
                legends:[],
                series:[]
            },
            charts2:{
                keys:[],
                successNums:[],
                errorNums:[]
            },
            charts3:{
                legends:[],
                series:[]
            },
            responseData:{},   // 响应数据
            dialogVisible:false,
            current_run_sum_time:0
        }
    },
    created(){
        this.findResult();
        this.loadChartData1();
        this.loadChartData2();
        this.loadChartData3();
        this.getCurrentRunTime();
    },
    methods:{

        // 清空所有结果数据
        removeAllResult(){
            this.$confirm('清空会导致之前的统计/结果数据全部删除, 是否确定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                testResultApi.deleteAllResult().then(response=>{
                    this.findResult();
                    this.loadChartData1();
                    this.loadChartData2();
                    this.loadChartData3();
                    this.getCurrentRunTime();
                })
            })
        },

        // 充值搜索框
        resetting(){
            this.resultQueryVo = {}
            this.findResult()
        },
        // 查询列表
        findResult(current = 1){
            this.current = current;
            testResultApi.findResult(this.current,this.size,this.resultQueryVo).then(response=>{
                this.resultList = response.data.list;
                console.log(this.resultList)
                this.total = response.data.total;
            })
        },

        // 获取总执行时间
        getCurrentRunTime(){
            console.log("1111111111111111111111111111111")
            let runTimeSum = 0
            testResultApi.findAllResult().then(response=>{
                let resultList = response.data.list;
                let size = resultList.length;
                for(let i = 0;i<size;++i){
                    console.log(resultList[i].last_run_time)
                    runTimeSum = runTimeSum + resultList[i].last_run_time
                }
                this.current_run_sum_time = runTimeSum
            })  

        },

        // 获取用例执行率
        loadChartData1(){
            chartsApi.getCaseSuccessRate().then(response=>{
                this.charts1.legends = response.data.legends;
                this.charts1.series = response.data.series;
                console.log("getCaseSuccessRate is run ")
                console.log(this.charts1.legends)
                // 饼图
                echarts.init(document.getElementById('charts1')).setOption({
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: this.charts1.legends
                    },
                    title:{
                        left: '48%',
                        top: 'center',
                        text:"成功率统计"
                    },
                    series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center:['55%','50%'],
                        avoidLabelOverlap: false,
                        label: {
                        show: false,
                        position: 'center'
                        },
                        labelLine: {
                        show: false
                        },
                        emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                        },
                        radius: ['20%', '35%'],
                        data:this.charts1.series,
                        itemStyle: {
                            　　normal: {
                                　　　　label: {
                                　　　　　　show:true,//是否显示 
                                　　　　　　position: 'top',//显示位置
                                           textStyle: { //文字样式
                            　　　　        }, 
                                　　　　formatter: function(params) {//核心部分 formatter 可以为字符串也可以是回调 
                                　　　　　　if(params.value){//如果当前值存在则拼接
                                　　　　　　　　return params.value
                                　　　　　　}else{//否则返回个空
                                　　　　　　　　return '';
                                　　　　　　}
                                　　　　}
                                　　}
                            　　}
                            }
                    }
                    ]
                });
            })
        },

        loadChartData2(){
            chartsApi.getPlatformSuccessAndErrorNum().then(response=>{
                this.charts2.keys = response.data.keys;
                this.charts2.successNums = response.data.successNums;
                this.charts2.errorNums = response.data.errorNums;
                echarts.init(document.getElementById('charts2')).setOption({
                    title:{
                        left: '35%',
                        top: 'top',
                        text:"平台区分测试结果统计"
                    },
                    xAxis: {
                        data: this.charts2.keys
                    },
                    yAxis: {},
                    series: [
                        {
                            type: 'bar',
                            data: this.charts2.successNums,
                            name: "成功人数",
                            itemStyle: {
                            　　normal: {
                                　　　　label: {
                                　　　　　　show:true,//是否显示 
                                　　　　　　position: 'top',//显示位置
                                           textStyle: { //文字样式
                            　　　　　  　     color: 'blue'
                            　　　　        }, 
                                　　　　formatter: function(params) {//核心部分 formatter 可以为字符串也可以是回调 
                                　　　　　　if(params.value){//如果当前值存在则拼接
                                　　　　　　　　return params.value 
                                　　　　　　}else{//否则返回个空
                                　　　　　　　　return '';
                                　　　　　　}
                                　　　　}
                                　　},
                            　  　color:'green'//折线颜色设置
                            　　}
                            }
                        },
                        {
                            type: 'bar',
                            data: this.charts2.errorNums,
                            name: "失败人数",
                            itemStyle: {
                            　　normal: {
                                　　　　label: {
                                　　　　　　show:true,//是否显示 
                                　　　　　　position: 'top',//显示位置
                                           textStyle: { //文字样式
                            　　　　　  　     color: 'red'
                            　　　　        }, 
                                　　　　formatter: function(params) {//核心部分 formatter 可以为字符串也可以是回调 
                                　　　　　　if(params.value){//如果当前值存在则拼接
                                　　　　　　　　return params.value
                                　　　　　　}else{//否则返回个空
                                　　　　　　　　return '';
                                　　　　　　}
                                　　　　}
                                　　},
                            　  　color:"red"//折线颜色设置
                            　　}
                            }
                        }
                    ] 
                })
            })
        },
        // 初始化统计表3
        loadChartData3(){
            chartsApi.getCurrentSuccessAndErrorNum().then(response=>{
                this.charts3.legends = response.data.legends;
                this.charts3.series = response.data.series;
                // 饼图
                echarts.init(document.getElementById('charts3')).setOption({
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: this.charts3.legends
                    },
                    title:{
                        left: '42%',
                        top: '0px',
                        text:"当前执行用例结果统计"
                    },
                    series: [
                    {
                        type: 'pie',
                        radius: ['10%', '50%'],
                        center:['55%','50%'],
                        avoidLabelOverlap: false,
                        label: {
                        show: false,
                        position: 'center'
                        },
                        labelLine: {
                        show: false
                        },
                        emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                        },
                        radius: ['80%', '50%'],
                        data:this.charts3.series,
                        itemStyle: {
                            　　normal: {
                                　　　　label: {
                                　　　　　　show:true,//是否显示 
                                　　　　　　position: 'top',//显示位置
                                           textStyle: { //文字样式
                            　　　　        }, 
                                　　　　formatter: function(params) {//核心部分 formatter 可以为字符串也可以是回调 
                                　　　　　　if(params.value){//如果当前值存在则拼接
                                　　　　　　　　return params.value
                                　　　　　　}else{//否则返回个空
                                　　　　　　　　return '';
                                　　　　　　}
                                　　　　}
                                　　}
                            　　}
                            }
                        }
                    ]
                });
            })
        },

        // 打开响应弹框
        showResponseDataDialog(responseData){
            this.dialogVisible = true
            this.responseData = responseData
        }

    }

}
</script>


<style>
#main-card{
    height: 1280px;
    width: 98%;
    margin-left: 13px;
    margin-top: 10px;
}

.jsoneditor-vue { height: 400px; }

.el-dialog{
    height: 600px;
}

</style>