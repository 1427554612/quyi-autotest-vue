import request from "@/utils/request"

export default{

    // 获取所有定时任务
    selectAllTask(){
        return request({
            url:"/api/test_task/selectAllTask",
            method:"get"
        })
    },

    // 组合查询带分页
    selectAllTaskAndPage(current,size,taskQuery){
        return request({
            url:`/api/test_task/selectAllTask/${current}/${size}`,
            method:"post",
            data:taskQuery
        })
    },

    // 执行定时任务
    runTask(taskId){
        return request({
            url:`/api/test_task/executeTask/${taskId}`,
            method:"get"
        })
    },

    // 暂停执行
    pauseRunTask(taskId,logId){
        return request({
            url:`/api/test_task/pauseExecute/${taskId}/${logId}`,
            method:"get"
        })
    },

    // 继续执行
    remuseRunTask(taskId,logId){
        return request({
            url:`/api/test_task/remuseExecute/${taskId}/${logId}`,
            method:"get"
        })
    },

    // 添加任务
    addTask(task){
        return request({
            url:`/api/test_task/addTask`,
            method:"post",
            data:task
        })
    },
    
    // 修改定时任务
    updateTask(taskId,task){
        return request({
            url:`/api/test_task/updateTask/${taskId}`,
            method:"post",
            data:task
        })
    },

    // 删除定时任务
    deleteTask(taskId){
        return request({
            url:`/api/test_task/deleteCronTask/${taskId}`,
            method:"delete",
        })
    },

    // 获取所有测试用例信息
    getAllCaseInfo(){
        return request({
            url:`/api/test_task/getAllCase`,
            method:"get",
        })
    },

    // 任务关联用例
    relationCase(taskId,caseList,configId){
        return request({
            url:`/api/test_task/relationCase/${taskId}/${configId}`,
            method:"post",
            data:caseList
        })
    },

    // 获取已关联的用例
    getRelationCase(taskId){
        return request({
            url:`/api/test_task/getRelationCase/${taskId}`,
            method:"get"
        })
    },

    // 停止任务执行
    stopTask(taskId,logId){
        return request({
            url:`/api/test_task/stopExecute/${taskId}/${logId}`,
            method:"get"
        })
    }
}