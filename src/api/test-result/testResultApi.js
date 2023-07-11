import request from "@/utils/request"

export default{

    // 分页查询
    findResult(current,size,resultQueryVo){
        return request({
            url:`/api/test_result/findResult/${current}/${size}`,
            method:"post",
            data:resultQueryVo
        })
    },

    // 查询所有
    findAllResult(){
        return request({
            url:`/api/test_result/findResult`,
            method:"get"
        })
    }
}