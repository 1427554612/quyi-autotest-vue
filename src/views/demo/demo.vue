<template>
    <div id="app">
        <el-card class="box-card"  id="main-card">
            <div slot="header" class="clearfix">
                <div slot="header" class="clearfix">
                    <span style="font-size:20px;font-weight: bolder;">结果管理</span>
                </div>
            </div>
            <div id="excel_table">
                <gc-spread-sheets :hostClass='hostClass' ref="my_sheets" @workbookInitialized="initDataExcel">
                    <gc-worksheet :dataSource="excel_data_list" :autoGenerateColumns = 'autoGenerateColumns' name="sheet1">
                        <gc-column :width="width" :height="height" :dataField="'caseNumber'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' vAlign="center"></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'caseName'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable'></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'caseTitle'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'apiPath'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'requestMethod'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'isMainProcessApi'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable'></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'requestHeaders'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'requestBody'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'isRun'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'assertMap'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'isParams'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                        <gc-column :width="width" :height="height" :dataField="'paramList'" :visible = 'visible' :formatter = 'formatter' :resizable = 'resizable' ></gc-column>
                    </gc-worksheet>
                </gc-spread-sheets>
            </div>
        </el-card>
    </div>
    

</template>

 <script>
 import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
  import * as GC from "@grapecity/spread-sheets";
  import "@grapecity/spread-sheets-vue";
import apiTestApi from '@/api/api-autotest/apiTestApi'
  export default {
    data(){
      return {
        hostClass:'spread-host',
        autoGenerateColumns:true,
        width:180,   // 每个单元格宽度
        height:100,
        visible:true,  // 表格是否显示
        resizable:false,
        // formatter:"$ #.00"
        excel_data_list:[], // 数据列表
        exce_length:0,
      }
    },
    created(){
    },
    methods:{
        // 初始化表格数据
        async initDataExcel(spread) {
            await apiTestApi.selectAllCase().then(response=>{
                this.excel_data_list = response.data.list;
                this.exce_length = this.excel_data_list.length;
            })
            await this.setExcelStyle(spread)
        },
        
        // 设置excel表格样式
        setExcelStyle(spread){
            spread.getActiveSheet().options.allowCellOverflow = false; //数据显示不可溢出单元格
            console.log(this.exce_length)
            let worksheet = spread.getSheetFromName("sheet1"); // 获取叫Sheet1的工作表
            worksheet.getRange(0,0,this.exce_length,this.exce_length).hAlign(GC.Spread.Sheets.HorizontalAlign.center)   // 设置水平居中
            .vAlign(GC.Spread.Sheets.HorizontalAlign.center); // 设置垂直居中
            worksheet.getRange(0, 0, this.exce_length, this.exce_length)
                .setBorder(new GC.Spread.Sheets.LineBorder("Black",GC.Spread.Sheets.LineStyle.thin),{ all: true }); // 设置内外边框为黑色实线
            for(let i = 0;i<this.exce_length;++i){
                worksheet.setColumnWidth(i,200);
                worksheet.setRowHeight(i,100);
            }
        }

    }
}

</script>



<style scoped>
#main-card{
    height: 900px;
    width: 98%;
    margin-left: 13px;
    margin-top: 10px;
}
.spread-host {
    width: 1780px;
    height: 800px;
}
</style>