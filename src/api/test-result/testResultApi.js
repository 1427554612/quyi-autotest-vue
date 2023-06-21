import request from "@/utils/request"

export default{

    findResult(){
        return request({
            url:"/api/test_result/findResult",
            method:"get"
        })
    }
}