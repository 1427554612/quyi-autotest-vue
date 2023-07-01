<template>
    <div id="app">
        <el-card class="box-card"  id="main-card">
            <div slot="header" class="clearfix">
                <div slot="header" class="clearfix">
                    <span style="font-size:20px;font-weight: bolder;">编辑用例</span>
                    <el-button style="margin-left:100px;" type="primary" @click="editTestCase">更新用例</el-button>
                </div>
            </div>
            <div class="hello">
              <div id="luckysheet" class="luckysheet-content"></div>
            </div>
        </el-card>
      </div>
  </template>
  
     
    <script>
    import apiTestApi from '@/api/api-autotest/apiTestApi';
    export default {
      name: "app",
      data() {
        return {
          dataSourse:[],   // 表格数据源
          dataList:[], // 最终解析后的数据
          rows:0, // 列的长度,
          headers:['用例编号','用例名称','用例标题','接口地址','请求方式','主流程api','请求头','请求体','是否执行','断言内容','是否参数化','参数化数据'],
          headersKey:['caseNumber','caseName','caseTitle','apiPath','requestMethod','isMainProcessApi','requestHeaders','requestBody','isRun','assertMap','isParams','paramList']
          
        };
      },
      mounted() {
          
      },
      created(){
        this.initDataSourse()
      },
      methods:{
        // 初始化数据源
        async initDataSourse(){
          await apiTestApi.selectAllCase().then(response=>{
            this.dataSourse = response.data.list
          })
          await this.objToExcel();
          await this.createExcel();
        },
  
        // 编辑用例
        async editTestCase(){
            this.$confirm('保存更新?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                let datas = luckysheet.getAllSheets()[0].data;
                let sendDatas = [];
                datas.forEach((data,index)=>{
                    let obj = {}
                    if(index===0){
                    }
                    else{
                        data.forEach((value,index)=>{
                            if(value===null){
                                obj[this.headersKey[index]] = value
                            }
                            else{
                                obj[this.headersKey[index]] = value.v
                            }
                        })
                    }
                    sendDatas.push(obj) 
                })
                sendDatas.splice(0,1)
                apiTestApi.editAllCase(sendDatas).then(response=>{
                    this.$message({
                        type:"sccess",
                        message:"保存成功！"
                    })
                    this.$router.push({path:'/api-test-edit'})
                })
            })
            
        },
  
  
        // case对象转表格格式
        objToExcel(){
          this.rows = this.headers.length;
          let headerIndex = 0;
          this.headers.forEach(header=>{
              this.dataList.push({r:0,c:headerIndex,v:header});
              ++headerIndex;
          })
          let r_index = 1;
          this.dataSourse.forEach(testCase=>{
            let values = Object.values(testCase);
            let c_index = 0;
            values.forEach(value=>{
              console.log("value = " + value)
              this.dataList.push({r:r_index,c:c_index,v:value})
              ++c_index;
            })
            ++r_index;
          })
        },
  
  
        // 创建表格
        createExcel(){
          luckysheet.create({
            container: "luckysheet", // 设定DOM容器的id
            title: "Luckysheet Demo", // 设定表格名称
            lang: "zh", // 设定表格语言
            plugins: ["chart"],
            data: [
              {
                name: "接口用例", //工作表名称
                color: "#eee333", //工作表(工作表名称底部边框线)颜色
                index: 0, //工作表索引(新增一个工作表时该值是一个随机字符串)
                status: 1, //激活状态
                order: 0, //工作表的下标
                hide: 1, //是否隐藏
                row: this.rows, //行数
                column: 10, //列数
                defaultRowHeight:100, //自定义行高,单位px
                defaultColWidth: 180, //自定义列宽,单位px
                celldata: this.dataList, //初始化使用的单元格数据,r代表行，c代表列，v代表该单元格的值，最后展示的是value1，value2
                config: {
                  merge: {}, //合并单元格
                  rowlen: {}, //表格行高
                  columnlen: {}, //表格列宽
                  rowhidden: {}, //隐藏行
                  colhidden: {}, //隐藏列
                  borderInfo: {}, //边框
                  authority: {}, //工作表保护
                },
     
                scrollLeft: 0, //左右滚动条位置
                scrollTop: 0, //上下滚动条位置
                luckysheet_select_save: [], //选中的区域
                calcChain: [], //公式链
                isPivotTable: false, //是否数据透视表
                pivotTable: {}, //数据透视表设置
                filter_select: {}, //筛选范围
                filter: null, //筛选配置
                luckysheet_alternateformat_save: [], //交替颜色
                luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
                luckysheet_conditionformat_save: {}, //条件格式
                frozen: {}, //冻结行列配置
                chart: [], //图表配置
                zoomRatio: 1, // 缩放比例
                image: [], //图片
                showGridLines: 1, //是否显示网格线
                dataVerification: {}, //数据验证配置
              },
            ],
            showtoolbar: false,
            showtoolbarConfig: {
              undoRedo: false, //撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
              paintFormat: false, //格式刷
              currencyFormat: false, //货币格式
              percentageFormat: false, //百分比格式
              numberDecrease: false, // '减少小数位数'
              numberIncrease: false, // '增加小数位数
              moreFormats: false, // '更多格式'
              font: false, // '字体'
              fontSize: false, // '字号大小'
              bold: false, // '粗体 (Ctrl+B)'
              italic: false, // '斜体 (Ctrl+I)'
              strikethrough: false, // '删除线 (Alt+Shift+5)'
              underline: false, // '下划线 (Alt+Shift+6)'
              textColor: false, // '文本颜色'
              fillColor: false, // '单元格颜色'
              border: false, // '边框'
              mergeCell: false, // '合并单元格'
              horizontalAlignMode: false, // '水平对齐方式'
              verticalAlignMode: false, // '垂直对齐方式'
              textWrapMode: false, // '换行方式'
              textRotateMode: false, // '文本旋转方式'
              image: false, // '插入图片'
              link: false, // '插入链接'
              chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
              postil: false, //'批注'
              pivotTable: false, //'数据透视表'
              function: false, // '公式'
              frozenMode: false, // '冻结方式'
              sortAndFilter: false, // '排序和筛选'
              conditionalFormat: false, // '条件格式'
              dataVerification: false, // '数据验证'
              splitColumn: false, // '分列'
              screenshot: false, // '截图'
              findAndReplace: false, // '查找替换'
              protection: false, // '工作表保护'
              print: false, // '打印'
            },
            showsheetbar: false, //是否显示底部sheet页按钮
            showsheetbarConfig: {
              add: false, //新增sheet
              menu: false, //sheet管理菜单
              sheet: true, //sheet页显示
            },
            showinfobar: false, //是否显示顶部信息栏
            showstatisticBar: false, //是否显示底部计数栏
            showstatisticBarConfig: {
              count: false, // 计数栏
              view: false, // 打印视图
              zoom: false, // 缩放
            },
            sheetFormulaBar: false, //是否显示公式栏
            allowCopy: false, //是否允许拷贝
            enableAddRow: true, //允许添加行
          });
        }
      
      }
      
    };
  </script>
    <style lang="css" scoped>
    .luckysheet-content {
      width: 100%;
      height: 770px;
      left: 10px;
      top: 10px;
      bottom: 1px;
    }
    #main-card{
      height: 900px;
      width: 98%;
      margin-left: 13px;
      margin-top: 10px;
  }
    </style>
   