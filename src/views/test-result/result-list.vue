<template>
    <div>
        <el-card class="box-card"  id="main-card">
            <div slot="header" class="clearfix">
                <div slot="header" class="clearfix">
                    <span style="font-size:20px;font-weight: bolder;">结果管理</span>
                </div>

                <!--统计图 -->
                <div style="float:left;width: 45%;border: 1px solid red;height: 750px;">
                    
                </div>
                

                <div style="float:right;width: 54%;height: 750px;">
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
                                <el-button @click="getConfigListAndPage()">查询</el-button>
                                <el-button @click="resetting()">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                        <div>
                            <el-table :data="resultList" style="width: 100%;margin-top: 10px;"  height="600" border  max-height="600">
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
                            <el-table-column prop="last_run_date" label="最近执行时间" width="180"> </el-table-column>
                            <el-table-column prop="last_run_time" label="最近执行耗时" width="120"> </el-table-column>
                        </el-table>
                        </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import testResultApi from '@/api/test-result/testResultApi';
export default{
    data(){
        return {
            resultQueryVo:{
                result_id:"",
                case_type:"",
                case_name:""
            },
            resultList:[],
        }
    },
    created(){
        this.findResult();
    },
    methods:{
        // 查询列表
        findResult(){
            testResultApi.findResult().then(response=>{
                this.resultList = response.data.list
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