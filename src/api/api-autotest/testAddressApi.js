import request from "@/utils/request"

export default{

    // 通过地址id查询地址
    selectAddressById(addressId){
        return request({
            url:`/test_service/test-address/selectAddressById/${addressId}`,
            method:"get"
        })
    },

    // 查询所有ip地址
    selectAllAddress(){
        return request({
            url:`/test_service/test-address/selectAllAddress`,
            method:"get"
        })
    },
    
    // 分页获取地址
    selectAddressPage(current,size){
        return request({
            url:`/test_service/test-address/getAllAddress/${current}/${size}`,
            method:"get"
        })
    },

    // 添加测试地址
    addAddress(address){
        return request({
            url:`/test_service/test-address/addAddress`,
            method:"post",
            data:address
        })
    },
    // 删除测试地址
    deleteAddress(addressId){
        return request({
            url:`/test_service/test-address/deleteAddress/${addressId}`,
            method:"delete"
        })
    }
}