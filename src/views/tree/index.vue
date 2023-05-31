<template>
  
  <div>
    <input type="file" placeholder="请选择文件" ref="fileUpload" enctype="multipart/form-data" accept=".*" @change="uploadFile()" />
  </div>
</template>
<script>
import { type } from 'os'
import apiTestApi from '@/api/api-autotest/apiTestApi'


export default{
  data(){
    return{
      query:{
      },
    }
  },
  filters:{
  
  },
  created(){
  },
  methods:{
    uploadFile:function(){
        console.log(this.$refs.fileUpload.files[0])
        let formDataFile = new FormData()
        formDataFile.append("file",this.$refs.fileUpload.files[0])
        apiTestApi.fileUpload(formDataFile).then(response=>{
          console.log(response.data.data)
        })
    }
  }
}
</script>
