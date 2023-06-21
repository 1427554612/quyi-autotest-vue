import request from "@/utils/request"

export default{

    // 获取用例执行成功率
    getCaseSuccessRate(){
        return request({
            url:"/api/test_result/charts/getCaseSuccessRate",
            method:"get"
        })
    }
}