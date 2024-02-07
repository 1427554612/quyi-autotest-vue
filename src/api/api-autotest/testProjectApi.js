import request from "@/utils/request"

export default{

    // 获取所有项目
    selectAllTestProject(){
        return request({
            url:"/test_service/test-project/selectAllTestProject",
            method:"get"
        })
    },

    // 分页获取项目
    selectProjectPage(current,size){
        return request({
            url:`/test_service/test-project/getAllProject/${current}/${size}`,
            method:"get"
        })
    },

    // 添加测试项目
    addProject(project){
        return request({
            url:`/test_service/test-project/addTestProject`,
            method:"post",
            data:project
        })
    },

    // 删除项目
    deleteProject(projectId){
        return request({
            url:`/test_service/test-project/deleteTestProject/${projectId}`,
            method:"delete"
        })
    }

}