<template>
    <div>
        <el-card class="box-card"  id="main-card">
            <div slot="header" class="clearfix">
                <div slot="header" class="clearfix">
                    <span style="font-size:20px;font-weight: bolder;">结果管理</span>
                </div>

                <!--统计图 -->
                <div style="float:left;width: 45%;height: 850px;margin-top: 10px;">
                    <el-card>
                        <div id="charts1" style="width: 700px;height: 250px;float: left;"></div>
                    </el-card>
                    <el-card style="margin-top:10px">
                        <div id="charts2" style="width: 700px;height: 250px;float: left;"></div>
                    </el-card>
                    <el-card style="margin-top:10px">
                        <div id="charts3" style="width: 700px;height: 250px;float: left;"></div>
                    </el-card>
                </div>
                

                <div style="float:right;width: 54%;height: 900px;;margin-top: 10px;">
                    <el-card style="height:835px">
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
                                <el-select v-model="resultQueryVo.case_type" placeholder="结果类型">
                                    <el-option label="api" value="api"></el-option>
                                    <el-option label="web-ui" value="post"></el-option>
                                    <el-option label="phone-ui" value="phone-ui"></el-option>
                                    <el-option label="performance" value="performance"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="margin-left: 10px;">
                                <el-button @click="findResult()">查询</el-button>
                                <el-button @click="resetting()">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                        <div>
                            <el-table :data="resultList" style="width: 100%;margin-top: 10px;"  height="500" border  max-height="600">
                                <el-table-column fixed prop="result_id" label="结果id" width="180"> 
                                    <template slot-scope="scope" >
                                        <router-link :to="'/result-info-list/'+scope.row.result_id" style = "text-decoration: underline ; color :blue;">
                                            {{ scope.row.result_id }}
                                        </router-link>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="case_name" label="用例名称" width="180"> </el-table-column>
                                <el-table-column prop="case_type" label="用例类型" width="100"> </el-table-column>
                                <el-table-column prop="run_num" label="执行总数" width="100"> </el-table-column>
                                <el-table-column prop="run_success_num" label="成功总数" width="100"> </el-table-column>
                                <el-table-column prop="run_error_num" label="失败总数" width="100"> </el-table-column>
                                <el-table-column prop="run_success_rate" label="执行成功率" width="100"> </el-table-column>
                                <el-table-column prop="last_run_result" label="最近执行结果" width="180"> </el-table-column>
                                <el-table-column prop="last_run_date" label="最近执行时间" width="180"> </el-table-column>
                                <el-table-column prop="last_run_time" label="最近执行耗时" width="120"> </el-table-column>
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
            </div>
        </el-card>
    </div>
</template>
<script>
import testResultApi from '@/api/test-result/testResultApi';
import * as echarts from 'echarts';
import chartsApi from '@/api/test-result/chartsApi';

export default{
    data(){
        return {
            resultQueryVo:{
                result_id:"",
                case_type:"",
                case_name:""
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
            }
        }
    },
    created(){
        this.findResult();
        this.loadChartData1();
        this.loadChartData2();
        this.loadChartData3();
    },
    methods:{
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
                this.total = response.data.total;
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
                        radius: ['50%', '70%'],
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
        }

    }

}
</script>


<style>
#main-card{
    height: 900px;
    width: 98%;
    margin-left: 13px;
    margin-top: 10px;
}
</style>