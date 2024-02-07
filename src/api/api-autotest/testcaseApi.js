import request from "@/utils/request"

export default{

    // 获取所有用例
    getAllCase(current,size){
        return request({
            url:`/test_service/test-case/getAllTestCase/${current}/${size}`,
            method:"get"
        })
    },
    
    // 条件查询用例带分页
    selectCaseByOptionsAndPage(current,size,testCaseQueryVo){
        return request({
            url:`/test_service/test-case/selectTestCaseAndPage/${current}/${size}`,
            method:"post",
            data:testCaseQueryVo
        })
    },

    // 获取对应的请求头键信息
    findHeaderKey(queryString){
        return request({
            url:`/test_service/test-case/findHeaderKey/${queryString}`,
            method:"get"
        })
    },
    // 获取对应的请求头值信息
    findHeaderValue(queryString){
        return request({
            url:`/test_service/test-case/findHeaderValue/${queryString}`,
            method:"get"
        })
    },

    // 添加测试用例
    addTestCase(testcase){
        return request({
            url:`/test_service/test-case/addTestcase`,
            method:"post",
            data:testcase
        })
    },

    // 获取当前项目的测试用例总数
    selectTestCaseCount(projectId){
        return request({
            url:`/test_service/test-case/selectTestCaseCount/${projectId}`,
            method:"get"
        })
    },
    // 当form-data有文件的时候
    formDataFileName(formData){
        return request({
            url:`/test_service/test-case/formDataFileName`,
            method:"post",
            data:formData
        })
    },
    // 当form-data没有文件的时候
    formDataStringName(formData){
        return request({
            url:`/test_service/test-case/formDataStringName`,
            method:"post",
            data:formData
        })
    },

    // 删除指定id的测试用例
    deleteTestCaseById(caseId){
        return request({
            url:`/test_service/test-case/deleteTestCase/${caseId}`,
            method:"delete"
        })
    },

    // 按照id执行某条用例
    runTestCaseById(caseId){
        return request({
            url:`/test_service/test-case/runCase/${caseId}`,
            method:"get"
        })
    },

    // 按照id获取用例详情
    getCaseInfo(caseId){
        return request({
            url:`/test_service/test-case/selectTestCaseInfo/${caseId}`,
            method:"get"
        })
    },

    // 分页获取请求头key
    getHeaderKey(current,size){
        return request({
            url:`/test_service/test-request-header/getAllHeaderKey/${current}/${size}`,
            method:"get"
        })
    },

    // 分页获取请求头value
    getHeaderValue(current,size){
        return request({
            url:`/test_service/test-request-header/getAllHeaderValue/${current}/${size}`,
            method:"get"
        })
    },

    // 添加请求头键
    addHeaderKey(headerKey){
        return request({
            url:`/test_service/test-request-header/addHeaderKey`,
            method:"post",
            data:headerKey
        })
    },

    // 删除请求头键 
    deleteHeaderKey(headerKeyId){
        return request({
            url:`/test_service/test-request-header/deleteHeaderKey/${headerKeyId}`,
            method:"delete"
        })
    },

    // 添加请求头值 
    addHeaderValue(headerValue){
        return request({
            url:`/test_service/test-request-header/addHeaderValue`,
            method:"post",
            data:headerValue
        })
    },

    // 删除请求头值 
    deleteHeaderValue(headerValueId){
        return request({
            url:`/test_service/test-request-header/deleteHeaderValue/${headerValueId}`,
            method:"delete"
        })
    }
      
}