<template>
    <el-main>
      <gc-spread-sheets :hostClass="hostClass" @workbookInitialized="initWorkbook">
        <gc-worksheet :dataSource="datas">
          <gc-column data-field="name"></gc-column>
          <gc-column data-field="age"></gc-column>
        </gc-worksheet>
        <gc-worksheet></gc-worksheet>
      </gc-spread-sheets>
    </el-main>
  </template>

<script>
  // 引入spreadJs相关文件
  import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
  import * as GC from "@grapecity/spread-sheets";
  import "@grapecity/spread-sheets-vue";
  
export default {
    data(){
        return {
            hostClass: "spread-host",
            tabStripVisible: true,
            datas: [
                { name: "lvyiyang", age: 23 },
                { name: "lgx", age: 22 },
                { name: "lming", age: 24 }
            ]
        }
    },

    created(){
    },
    methods:{
        initWorkbook(spread) {
            let worksheet = spread.getSheetFromName("Sheet1"); // 获取叫Sheet1的工作表
            // 设置单元格文本  setText \ setValue
            worksheet.setText(2,0,"急啊急啊急啊");
            // 获取单元格文本：  worksheet.getCell(2,0).text() / worksheet.getCell(2,0).value()
            console.log(worksheet.getCell(2,0).text())
            worksheet.getRange(0,0,3,3).hAlign(GC.Spread.Sheets.HorizontalAlign.center)   // 设置水平居中
                .vAlign(GC.Spread.Sheets.HorizontalAlign.center); // 设置垂直居中
            worksheet.setColumnWidth(0, 200);  // 设置列宽
            worksheet.setRowHeight(0, 100);  // 设置行高
            let cellRange = new CellRange(1,1)
            console.log(cellRange.rowCount)
        }
    }
}

</script>

<style>
  .spread-host {
    width: 100%;
    height: 600px;
  }
</style>