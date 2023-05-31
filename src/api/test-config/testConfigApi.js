import request from '@/utils/request'

export default{
    
    // 查询所有配置
    selectAllConfig(){
        return request({
            url:"/api/test_config/selectConfig",
            method:"get"
        })
    },

    // 根据id查询配置
    selectConfigById(configId){
        return request({
            url:`/api/test_config/selectConfig/${configId}`,
            method:"get"
        })
    },

    // 分页组合查询配置
    selectQueryVoAndPage(current,size,testConfigQuery){
        return request({
            url:`/api/test_config/selectConfig/${current}/${size}`,
            method:"post",
            data:testConfigQuery
        })
    },


    // 添加配置
    saveTestConfig(testConfig){
        return request({
            url:"/api/test_config/saveTestConfig",
            method:"post",
            data:testConfig
        })
    },

    // 删除配置
    deleteTestConfig(configId){
        return request({
            url:`/api/test_config/deleteTestConfig/${configId}`,
            method:"delete"
        })
    },

    // 修改配置
    updateTestConfig(configId,testConfig){
        return request({
            url:`/api/test_config/updateTestConfig/${configId}`,
            method:"put",
            data:testConfig
        })
    }
}