import request from "@/utils/request"

export default{

    // 查询日志文档数
    findLogTree(){
        return request({
            url:"/api/test_result/findLogTree",
            method:"get"
        })
    },

    // 查询指定日志
    findLog(logMap){
        return request({
            url:"/api/test_result/findLog",
            method:"post",
            data:logMap
        })
    }
}