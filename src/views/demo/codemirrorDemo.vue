<template>
    <!-- Two-way Data-Binding -->
    <!-- <codemirror v-model="code" :options="cmOptions" /> -->
    <!-- Or manually control the data synchronization -->
    <div id="main">
        <h1>{{ obj.stu.name }}</h1>
    </div>
</template>
  
<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
  ,
  data(){
    return {
      obj:{stu:{name:"zhangjun"}}
    }
  }
}
</script>

<style scoped>

</style>



