<template>
    <div>
        <el-card class="box-card"  id="main-card">
            <div slot="header" class="clearfix">
                <div slot="header" class="clearfix">
                    <span style="font-size:20px;font-weight: bolder;">结果管理</span>
                </div>
                <el-table :data="resultList" style="width: 100%;margin-top: 10px;" height="250" border>
                    <el-table-column fixed prop="result_id" label="结果id" width="120"> </el-table-column>
                    <el-table-column prop="case_name" label="用例名称" width="120"> </el-table-column>
                    <el-table-column prop="case_type" label="用例类型" width="120"> </el-table-column>
                    <el-table-column prop="run_num" label="执行总数" width="120"> </el-table-column>
                    <el-table-column prop="run_success_num" label="成功总数" width="120"> </el-table-column>
                    <el-table-column prop="run_error_num" label="失败总数" width="120"> </el-table-column>
                    <el-table-column prop="run_success_rate" label="执行成功率" width="120"> </el-table-column>
                    <el-table-column prop="last_run_date" label="最近执行时间" width="120"> </el-table-column>
                    <el-table-column prop="last_run_time" label="最近执行耗时" width="120"> </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>
<script>
export default{
    data(){
        return {
            resultList:[]
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