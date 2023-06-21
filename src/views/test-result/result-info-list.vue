<template>
    <div>
        <el-card class="box-card" style="width:98%;margin-left: 15px;margin-top: 10px;height: 900px;">
            <div slot="header" class="clearfix">
                <span style="font-size:20px;font-weight: bolder;">日志详情管理</span>
            </div>
            <div>
                <splitpanes class="default-theme" @resize="paneSize = $event[0].size" style="height: 815px" >
                    <pane :size="paneSize" min-size="20">
                        <div id="left">
                            <span>{{ paneSize }}%</span>
                        </div>
                    </pane>
                    <pane :size="100 - paneSize" min-size="20">
                        <div id="rigth">
                            <span>{{ 100 - paneSize  }}%</span>
                        </div>
                    </pane>
                </splitpanes>
            </div>
        </el-card>
    </div>

</template>


<script>
// In your Vue component.
import { Splitpanes,Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import * as echarts from 'echarts';

export default {
  components: { Splitpanes:Splitpanes, Pane:Pane },
  data(){
    return{
        paneSize:50
    }
  },
  created(){

  },
  methods: {
    resize() {},
    initEcharts:function(){
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
                      { value: 15, name: 'A' },
                      { value: 20, name: 'B' },
                      { value: 10, name: 'C' },
                      { value: 30, name: 'D' },
                      { value: 20, name: 'E' }
                    ]
                  }
                ]
            });
    }
  },
};
</script>


