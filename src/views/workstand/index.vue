<template>
  <div class="workstand-container"  >
    <el-card id="workstand-card" style="width:99%;margin: 10px;background-color:#e5e4e4;">
      <div slot="header" class="clearfix">
            <span><b>工作台</b></span>
      </div>

      <div style="background-color:whitesmoke;height:200px">
        <div style="padding:10px;font-size:18px;font-weight:bolder">接口自动化</div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div>
              <el-statistic
                group-separator=","
                :precision="2"
                :value="value1"
                title="执行总数"
              ></el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-statistic title="男女比">
                <template slot="formatter">
                  456/2
                </template>
              </el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-statistic
                group-separator=","
                :precision="2"
                decimal-separator="."
                :value="value1"
                title="增长人数"
              >
                <template slot="prefix">
                  <i class="el-icon-s-flag" style="color: red"></i>
                </template>
                <template slot="suffix">
                  <i class="el-icon-s-flag" style="color: blue"></i>
                </template>
              </el-statistic>
            </div>
          </el-col>
        </el-row>
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
  data(){
    return{
      title1:"执行总数",
      value1:100
    }
  },
  methods:{
  }
}
</script>

<style>
#workstand-card{
  height: 1000px;
}
</style>
