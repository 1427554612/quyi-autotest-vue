<template>
  <div class="workstand-container"  >
    <el-card id="workstand-card" style="width:99%;margin: 10px;background-color:#e5e4e4;">
      <div slot="header" class="clearfix">
            <span><b>工作台</b></span>
      </div>

      <div style="background-color:whitesmoke;height:200px">
        <div style="padding:10px;font-size:18px;font-weight:bolder">接口自动化</div>
      </div>
      <div style="background-color:whitesmoke;height:200px;margin-top: 10px;">
        <div style="padding:10px;font-size:18px;font-weight:bolder">UI自动化</div>
      </div>
      <div style="background-color:whitesmoke;height:200px;margin-top: 10px;"></div>
      <div style="background-color:whitesmoke;height:500px;margin-top: 10px;"></div>
    </el-card>

  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts';
import apiTestApi from '@/api/api-autotest/apiTestApi';
import testResultApi from '@/api/test-result/testResultApi';
import testConfigApi from '@/api/test-config/testConfigApi';


export default {
  name: 'Dashboard',
  computed: {
    // ...mapGetters([
    //   'name'
    // ])
  },
  mounted(){
        // // 在通过mounted调用即可
        // this.echartsInit()
    },
  methods:{
    //初始化echarts
    echartsInit() {
            //柱形图
            //因为初始化echarts 的时候，需要指定的容器 id='main'
            echarts.init(document.getElementById('main')).setOption({
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)'
                    }
                }]
            });
            // 饼图
            echarts.init(document.getElementById('main-2')).setOption({
                legend: {
                  orient: 'vertical',
                  x: 'left',
                  data: ['A', 'B', 'C', 'D', 'E']
                },
                title:{
                  left: 'center',
                  top: 'center'
                },
                series: [
                  {
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                      show: false,
                      position: 'center'
                    },
                    labelLine: {
                      show: false
                    },
                    emphasis: {
                      label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    },
                    radius: ['50%', '70%'],
                    data: [
                      { value: 20, name: 'A' },
                      { value: 20, name: 'B' },
                      { value: 10, name: 'C' },
                      { value: 30, name: 'D' },
                      { value: 20, name: 'E' }
                    ]
                  }
                ]
            });
            echarts.init(document.getElementById('main-3')).setOption({
              xAxis: {
                type: 'category',
                data: ['A', 'B', 'C']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                  {
                    data: [120, 200, 150],
                    type: 'line'
                  }
              ]
            })
            
        }

    }
}
</script>

<style>
#workstand-card{
  height: 1000px;
}
</style>
