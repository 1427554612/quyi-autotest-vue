import request from "@/utils/request"

export default{

    // 分页查询结果
    findResult(current,size,resultQueryVo){
        return request({
            url:`/api/test_result/findResult/${current}/${size}`,
            method:"post",
            data:resultQueryVo
        })
    },

    // 分页查询结果详情
    findAllResultInfo(resultId,current,size){
        return request({
            url:`/api/test_result/info/getAll/${resultId}/${current}/${size}`,
            method:"get"
        })
    },

    // 查询所有
    findAllResult(){
        return request({
            url:`/api/test_result/findResult`,
            method:"get"
        })
    },
    
    // 清空所有结果数据
    deleteAllResult(){
        return request({
            url:`/api/test_result/deleteAllResult`,
            method:"delete"
        })
    },
    
    // 根据id查询结果
    findById(resultId){
        return request({
            url:`/api/test_result/findById/${resultId}`,
            method:"get"
        })
    },

    // 查询所有详情列表
    findResultInfoList(resultId,sort){
        return request({
            url:`/api/test_result/info/findList/${resultId}/${sort}`,
            method:"get"
        })
    }
}