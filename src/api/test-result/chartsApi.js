import request from "@/utils/request"

export default{

    // 获取用例执行成功率
    getCaseSuccessRate(){
        return request({
            url:"/api/test_result/charts/getCaseSuccessRate",
            method:"get"
        })
    },

    // 统计测试平台所有成功和失败数
    getPlatformSuccessAndErrorNum(){
        return request({
            url:"/api/test_result/charts/getPlatformSuccessAndErrorNum",
            method:"get"
        })  
    },

    // 统计当前成功和失败的用例数
    getCurrentSuccessAndErrorNum(){
        return request({
            url:"/api/test_result/charts/getCurrentSuccessAndErrorNum",
            method:"get"
        })  
    }
}