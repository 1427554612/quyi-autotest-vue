<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
      <!--图标-->
      <div style="width: 400px;height: 400px;float: left;" id="main">
    
      </div>

      <!--图标-->
      <div style="width: 400px;height: 400px;float: left;margin-left: 150px;" id="main-2">
    
      </div>

      <!--图标-->
      <div style="width: 400px;height: 400px;float: left;margin-left: 150px;" id="main-3">
    
  </div>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted(){
        // 在通过mounted调用即可
        this.echartsInit()
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
                    data: [
                      { value: 335, name: 'A' },
                      { value: 310, name: 'B' },
                      { value: 234, name: 'C' },
                      { value: 135, name: 'D' },
                      { value: 1548, name: 'E' }
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

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
