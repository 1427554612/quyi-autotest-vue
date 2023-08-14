import request from "@/utils/request"

export default{

    // 获取用例执行成功率
    run(data){
        return request({
            url:"/api/script/run",
            method:"post",
            data:data
        })
    }
}