<template>
    <div class="app-container">
        <el-card class="box-card" style="width:98%;margin-left: 10px;">
            <div slot="header" class="clearfix">
                <span><b>配置数据</b></span>
            </div>
            <div style="width:95%">
                <el-form label-width="120px" :model="testConfig" :rules="validator" ref="configForm">
                    <el-form-item label="配置id" v-if="testConfig.configId" >
                        <el-input v-model="testConfig.configId" style="width:300px" />
                    </el-form-item>
                    <el-form-item label="配置名称" prop="configName" >
                        <el-input v-model="testConfig.configName" style="width:300px"/>
                    </el-form-item>
                    <el-form-item label="创建人" prop="updateUp">
                        <el-input v-model="testConfig.updateUp" style="width:300px"/>
                    </el-form-item>
                    <el-form-item label="配置数据" prop="configData">
                        <vue-json-editor class="editor" id="jsonEdit" style="width:800px" v-model="testConfig.configData" :showBtns="false" :mode="'code'"
                        @json-change="onJsonChange"  @has-error="onError" />
                    </el-form-item>
                    <el-form-item label="配置类型" prop="configType">
                        <el-select v-model="testConfig.configType" clearable placeholder="请选择">
                            <el-option value="api" label="api"/>
                            <el-option value="web-ui" label="web-ui"/>
                            <el-option value="phone-ui" label="phone-ui"/>
                            <el-option value="performance" label="performance"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="配置说明" prop="configMark">
                        <el-input type="textarea" v-model="testConfig.configMark" style="width:800px;" id="textarea"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="saveBtnDisabled" type="primary" @click="addOrUpdate">保存</el-button>
                        <router-link :to="'/config-list'">
                            <el-button :disabled="saveBtnDisabled" type="danger" style="margin-left:20px">取消</el-button>
                        </router-link>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import vueJsonEditor from 'vue-json-editor'
import testConfigApi  from '@/api/test-config/testConfigApi';
export default {
    components:{
        vueJsonEditor:vueJsonEditor
    },
    watch:{
    },

    data(){
       return {
            validator:{
                configName:[{ required: true, message: '请输入配置名称', trigger: 'blur' }],
                configData:[{ required: true, message: '请输入配置数据', trigger: 'blur' }],
                updateUp:[{ required: true, message: '请输入创建人', trigger: 'blur' }],
                configType:[{ required: true, message: '请选择类型', trigger: 'blur' }],
                configMark:[{ required: true, message: '请输入备注', trigger: 'blur' }]
            },
            testConfig:{
                configId:"",
                configName:"",
                configType:"",
                configData:{},
                configMark:"",
                updateUp:""
            }   
       }
    },
    watch:{
        // 监听路由地址
        $route(to,from){
            this.init()
        }
    },
    created(){
        this.init()
    },
    methods:{
        // 初始化操作、判断当前路由是否带id
        init:function(){
            if(this.$route.params&&this.$route.params.configId) {
                console.log(this.$route.params.configId)
                // 调用回显 
                this.callbackShowConfig(this.$route.params.configId)
            }else{
                this.testConfig ={}  
            }
        },
        // 当数据改变
        onJsonChange:function(jsonValue){
            this.testConfig.configData = jsonValue
        },

        
        // 添加或修改配置
        addOrUpdate:function(){
            this.$refs.configForm.validate((valid) => {
                if (valid) {
                    if(this.testConfig.configId){
                    console.log("-----调用新增------")
                    this.updateConfig()
                    }
                    else{
                        console.log("-----调用修改------")
                        this.saveConfig()
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })

        },
        
        // 保存配置数据
        saveConfig:function(){
            testConfigApi.saveTestConfig(this.testConfig).then(response=>{
                this.$message({
                    message:"保存成功!",
                    type:"success"
                })
                this.$router.push({"path":"/config-list"})
            }).catch(error=>{
                this.$message.error(error);
            })
        },

        // 修改配置数据
        updateConfig:function(){
            testConfigApi.updateTestConfig(this.testConfig.configId,this.testConfig).then(response=>{
                this.$message({
                    message:"修改成功!",
                    type:"success"
                })
                this.$router.push({"path":"/config-list"})
            }).catch(error=>{
                this.$message.error(error);
            })
        },

        // 回显配置数据
        callbackShowConfig:function(configId){
            testConfigApi.selectConfigById(configId).then(response=>{
                this.testConfig = response.data.testConfig
                console.log(this.testConfig)
            })
        }
    }
}
</script>

<style>
#textarea{
    height: 200px;
}
.jsoneditor-vue { height: 250px; }
</style>