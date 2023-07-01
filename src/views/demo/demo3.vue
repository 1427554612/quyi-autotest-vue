<template>
    <div
      style="
        width: 1500px;
        height: 600px;
        border: 1px solid #ddd;
        position: relative;
      "
    >
      <div style="display: flex">
        <p>在线表格练习</p>
        <input id="uploadBtn" type="file" @change="loadExcel" />
        <el-button type="primary" @click="downloadExcel">下载</el-button>
      </div>
      <!-- luckysheet容器 -->
      <div
        id="luckysheet"
        style="
          margin: 0px;
          padding: 0px;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0px;
          top: 50px;
        "
      ></div>
    </div>
  </template>
  
  <script setup>
  import LuckyExcel from "luckyexcel";
  
  const jsonData = ref({});
  
  //导入excel
  const loadExcel = (evt) => {
    const files = evt.target.files;
    if (files == null || files.length == 0) {
      alert("请选择文件");
      return;
    }
  
    //获取文件名
    let name = files[0].name;
    //获取文件后缀
    let suffixArr = name.split("."),
      suffix = suffixArr[suffixArr.length - 1];
    if (suffix != "xlsx") {
      alert("当前只能导入xlsx格式文件");
      return;
    }
  
    //转换导入的excel
    LuckyExcel.transformExcelToLucky(
      files[0],
      function (exportJson, luckysheetfile) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          alert("无法读取excel文件的内容，当前不支持xls文件!");
          return;
        }
  
        console.log("exportJson", exportJson);
        jsonData.value = exportJson;
  
        //销毁之前的表格
        window.luckysheet.destroy();
  
        //创建新的表格
        window.luckysheet.create({
          container: "luckysheet",
          showinfobar: false,
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
        });
      }
    );
  };
  const downloadExcel = () => {
    console.log("下载的数据：", luckysheet.getAllSheets());
    //第2个参数是导出的文件名
    exportExcel(luckysheet.getAllSheets(), "下载");
  };
  
  onMounted(() => {
    console.log("表格：", luckysheet);
    luckysheet.create({
      container: "luckysheet",
      title: "测试Excel", // 表 头名
      lang: "zh", // 中文
      showtoolbar: true, // 是否显示工具栏
      showinfobar: false, // 是否显示顶部信息栏
      showsheetbar: true, // 是否显示底部sheet按钮
    });
  });
  </script>
  
<style scoped lang="scss">
</style>
