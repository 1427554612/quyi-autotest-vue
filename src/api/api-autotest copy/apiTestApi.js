import request from "@/utils/request"

export default{

    // 获取所有接口用例
    selectAllCase:function(){
        return request({
            url:"/api/api-autotest/selectAllCase",
            method:"get"
        })
    },

    // 编辑所有接口
    editAllCase:function(apiTestCase){
        return request({
            url:"/api/api-autotest/editCase",
            method:"put",
            data:apiTestCase
        })
    },

    // 上传接口
    fileUpload:function(formData){
        return request({
            url:"/api/api-autotest/upload",
            method:"post",
            data:formData
        })
    },

    // 执行单一用例
    runCase:function(caseName,configId){
        return request({
            url:`/api/api-autotest/runCase/${caseName}/${configId}`,
            method:"get"
        })
    },

     // 批量执行用例
     selectRunCase:function(testCaseList,configId){
        return request({
            url:`/api/api-autotest/runCase/${configId}`,
            method:"post",
            data:testCaseList
        })
    }
    
}