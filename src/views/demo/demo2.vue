<template>
    <el-main>
      <gc-spread-sheets :hostClass="hostClass" @workbookInitialized="initWorkbook">
        <gc-worksheet></gc-worksheet>
        <gc-worksheet :dataSource="students">
          <gc-column data-field="name"></gc-column>
          <gc-column data-field="age"></gc-column>
        </gc-worksheet>
      </gc-spread-sheets>
    </el-main>
  </template>
  
  <script>
  // 引入spreadJs相关文件
  import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
  import * as GC from "@grapecity/spread-sheets";
  import "@grapecity/spread-sheets-vue";
  
  import { mapState, mapGetters, mapActions } from "vuex"; //导入vuex中mapState,mapActions
  
  export default {
    name: "UserListTest",
    data() {
      return {
        hostClass: "spread-host2",
        person: {
          name: "lvyiyang",
          age: 23,
          interests: ["computer", "game", "code"]
        },
        tabStripVisible: true,
        students: [
          { name: "lvyiyang", age: 23 },
          { name: "lgx", age: 22 },
          { name: "lming", age: 24 }
        ]
      };
    },
  
    computed: {
    },
    methods: {
        initWorkbook(spread) {
        console.log("start");
        // let worksheet = spread.getActiveSheet(); // 获取活动的工作表
        // let worksheet = spread.getSheet(0); // 获取下标为0的工作表
        let worksheet = spread.getSheetFromName("Sheet1"); // 获取叫Sheet1的工作表
  
        worksheet.setText(1, 1, "setting Values");
        worksheet.setText(2, 1, "Number");
        worksheet.setValue(2, 2, 23); // Number由setValue设置
        worksheet.setText(3, 1, "Text");
        worksheet.setText(3, 2, "GrapeCity");
        worksheet.setText(4, 1, "DateTime");
        worksheet
          .getCell(4, 2)
          .value(new Date(2022, 10, 11))
          .formatter("yyyy-mm-dd"); // 格式化由getCell().formatter('')进行
  
        worksheet.addSpan(1, 1, 1, 2); // 合并单元格
        worksheet
          .getRange(1, 1, 1, 2)
          .hAlign(GC.Spread.Sheets.HorizontalAlign.center); // 水平居中
        worksheet
          .getRange(1, 1, 4, 2)
          .setBorder(
            new GC.Spread.Sheets.LineBorder(
              "Black",
              GC.Spread.Sheets.LineStyle.thin
            ),
            { all: true }
          ); // 设置内外边框为黑色实线
        worksheet
          .getRange(2, 1, 3, 2)
          .setBorder(
            new GC.Spread.Sheets.LineBorder(
              "Black",
              GC.Spread.Sheets.LineStyle.dotted
            ),
            { inside: true }
          ); // 设置内边框为黑色虚线
        worksheet
          .getRange(1, 1, 1, 2)
          .backColor("rgb(130,188,0")
          .foreColor("rgb(255,255,255"); // 设置背景色和字体颜色
        worksheet.getRange(3, 1, 1, 2).backColor("rgb(211,211,211)");
        worksheet.setColumnWidth(1, 200); // 设置列宽
        worksheet.setColumnWidth(2, 200);
  
        let source = new GC.Spread.Sheets.Bindings.CellBindingSource(this.person);
        worksheet.setBindingPath(1, 0, "name");
        worksheet.setBindingPath(2, 0, "age");
        worksheet.setBindingPath(3, 0, "interests.1"); // 数组.下标：获取单个数组项，数组：获取所有数组项，逗号分隔开
        worksheet.setDataSource(source); // 数据绑定
        worksheet.setColumnWidth(0, 200);
  
        spread.addSheet(spread.getSheetCount()); // 添加一个工作表
        spread.setActiveSheetIndex(1); // 设置活动单元格
  
        let newWorkSheet = new GC.Spread.Sheets.Worksheet("New Sheet"); // 自定义一个工作表
        newWorkSheet.name("Hello"); // 重命名表单
        newWorkSheet.setRowCount(20, GC.Spread.Sheets.SheetArea.viewport); // 设置可见的行数
        newWorkSheet.addRows(5, 10); // 插入行数
        newWorkSheet.deleteRows(20, 10); // 删除行数
        newWorkSheet.setRowResizable(1, false); // 设置行在UI中高度不可拖拽修改
        newWorkSheet.setColumnResizable(1, false); // 设置列在UI中的宽度不可拖拽修改
        newWorkSheet.setColumnWidth(1, 40); // 设置列宽
        newWorkSheet.setRowHeight(1, 40); // 设置行高
        //newWorkSheet.setRowVisible(1, false); // 设置行可见（区别于删除）
        //newWorkSheet.setColumnVisible(1, false); // 设置列可见 (区别于删除)
  
        spread.addSheet(spread.getSheetCount(), newWorkSheet); // 追加自定义单元格
        console.log(
          spread
            .getActiveSheet()
            .getCell(0, 0, GC.Spread.Sheets.SheetArea.viewport)
        ); // 获取指定单元格对象
        console.log(
          spread
            .getActiveSheet()
            .getRange(0, 0, 2, 2, GC.Spread.Sheets.SheetArea.viewport)
        ); //获取指定单元格集合对象
        console.log(
          spread
            .getActiveSheet()
            .getRange("A1:B2", GC.Spread.Sheets.SheetArea.viewport)
        ); //获取指定单元格集合对象
        console.log(
          spread
            .getActiveSheet()
            .getCellRect(0, 0, GC.Spread.Sheets.SheetArea.viewport)
        ); // 获取指定单元格的高和宽
        spread.getActiveSheet().options.allowCellOverflow = true; //数据显示可溢出单元格
  
        let sheet = spread.getActiveSheet();
        let style = new GC.Spread.Sheets.Style(); // 定义样式对象
        style.backColor = "red"; // 设置背景色
        style.foreColor = "white"; // 设置字体颜色
        style.isVerticalText = "true"; // 设置字体写入方向
        // sheet.setStyle(1,1,style,GC.Spread.Sheets.SheetArea.viewport);  // 单元格嵌入样式
        // sheet.setStyle(0,-1, style, GC.Spread.Sheets.SheetArea.viewport); // 整行嵌入样式
        // sheet.setStyle(-1,0,style,GC.Spread.Sheets.SheetArea.viewport);    //整列嵌入样式 单元格>行>列 显示的优先级
        // spread.removeSheet(spread.getSheetCount() - 1); // 尾删
  
        style.name = "style1"; // 设置样式名
        sheet.addNamedStyle(style); // 添加入表单中
        // spread.addNamedStyle(style); // 添加入excel中
  
        sheet.getNamedStyle("style1"); //获取style1对应的样式对象
        sheet.setStyleName(0, 1, "style1"); // 通过样式对象的name设置样式
  
        sheet.removeNamedStyle("style1"); // 表单移除style样式对象
  
        sheet.getCell(0, 0).backColor({
          degree: 45,
          stops: [
            { position: 0, color: "red" },
            { position: 0.5, color: "white" },
            { position: 1, color: "blue" }
          ]
        }); // 设置单元格背景色
        sheet.getCell(0, 1).backColor({
          type: "path",
          left: 0.4,
          top: 0.4,
          right: 0.6,
          bottom: 0.6,
          stops: [
            { position: 0, color: "red" },
            { position: 0.5, color: "white" },
            { position: 1, color: "yellow" }
          ]
        }); // 设置单元格背景色
        sheet.getCell(1, 0).backColor({
          type: GC.Spread.Sheets.PatternType.lightHorizontal,
          backgroundColor: "white",
          patternColor: "black"
        }); // 设置单元格背景色
  
        sheet.getCell(0, 0).font("italic bold 15px/30px Georgia"); // 设置字体样式
        let style1 = new GC.Spread.Sheets.Style();
        style1.showEllipsis = true; // 省略号设置
        style1.textDecoration =
          GC.Spread.Sheets.TextDecorationType.doubleUnderline;
        sheet.setStyle(2, 0, style1); // 设置字体样式(双下划线)
  
        // sheet
        //   .getCell(1, 1)
        //   .vAlign(GC.Spread.Sheets.VerticalAlign.bottom)
        //   .hAlign(GC.Spread.Sheets.HorizontalAlign.left); //设置文字水平对齐和垂直对齐方式
  
        // sheet.addRows(3, 5);
        // sheet.setText(3, 0, "Hello SpreadJs"); // 先设置超链接文本
        // sheet.setHyperlink(
        //   3,
        //   0,
        //   {
        //     url: "https://www.grapecity.com/spreadjs", // 链接地址
        //     tooltip: "spreadJs主页链接", // 链接提示
        //     linkColor: "blue", // 链接跳转前颜色
        //     visitedLinkColor: "red", // 链接跳转后颜色
        //     target: GC.Spread.Sheets.Hyperlink.HyperlinkTargetType.blank //链接空白页跳转
        //   },
        //   GC.Spread.Sheets.SheetArea.viewport
        // );
  
        // let button1 = new GC.Spread.Sheets.CellTypes.Button(); // 实例化一个按钮对象
        // button1.text('按钮1');
        // sheet.getCell(3,1).cellType(button1);
        // sheet.setCellType(3,1,button1); //按钮单元格
  
        // var lines = [{text:'梨子',value:'lizi'},{text:'牌',value:'pai'},{text:'笔记本',value:'bijiben'}];
        // let selectOptions = new GC.Spread.Sheets.CellTypes.ComboBox();
        // selectOptions.items(lines);
        // sheet.setCellType(4,0,selectOptions,GC.Spread.Sheets.SheetArea.viewport); // 下拉列表单元格
  
        // let checkbox = new GC.Spread.Sheets.CellTypes.CheckBox();
        // sheet.setCellType(4,1,checkbox,GC.Spread.Sheets.SheetArea.viewport); // 复选框单元格
        // checkbox.caption("lizi")
  
        // let radioButtonList = new GC.Spread.Sheets.CellTypes.RadioButtonList();
        // radioButtonList.items(lines);
        // sheet.setCellType(5,0,radioButtonList,GC.Spread.Sheets.SheetArea.viewport); // 单选列表单元格
  
        // let checkboxList = new GC.Spread.Sheets.CellTypes.CheckBoxList();
        // checkboxList.items(lines);
        // sheet.setCellType(5,1,checkboxList,GC.Spread.Sheets.SheetArea.viewport); // 多选列表单元格
  
        // sheet.getCell(2,1).wordWrap(true); // 自动换行
        //sheet.getCell(2,0).textIndent(2); // 文本缩进
        //sheet.getCell(2,0).shrinkToFit(true); //缩小以合适
  
        // spread.clearSheets(); // 清空所有单元格
        // spread.changeSheetIndex("Sheet1",1); // 更改指定工作表下标
  
        spread.options.tabNavigationVisible = false; // 左侧的左右箭头是否显示
        spread.options.tabEditable = true; // 工作表是否可以重名
        spread.options.allowSheetReorder = false; // 工作表设置是否可以拖动
        spread.getActiveSheet().options.sheetTabColor = "red"; // 设置指定的工作表名颜色
        spread.options.newTabVisible = false; // +按钮是否显示
        spread.options.tabStripRatio = 1; // 设置表单标签区域百分比
        spread.options.tabStripPosition =
          GC.Spread.Sheets.TabStripPosition.bottom; // 设置表单标签区域位置，高版本可在左右两侧时滚动切换
        spread.options.tabStripWidth = 200; //表单区域在左侧或者右侧时，对应表单名的长度，默认80px
        // spread.options.allSheetsListVisible = GC.Spread.Sheets.AllSheetsListVisibility.auto; // 表单列表的三横线是否显示
        
        let sheet3 = spread.getSheetFromName("Sheet3");
        let persons = [
          ['姓名','年龄'],
          ['张三','34'],
          ['张三','34'],
          ['张三','34'],
          ['张三','34'],
          ['张三','34'],
        ];
        spread.suspendPaint();
        sheet3.setArray(0,0,persons); // 可以
        spread.resumePaint();
        // console.log(this.students)
        // let table = sheet3.tables.addFromDataSource('Table1',1,1,this.students);
  
  
        spread.setActiveSheetIndex(3);
        let hello = spread.getActiveSheet();
        let customers = [
          {"ID":0,"NAME":"name1",INFO:"info1"},
          {"ID":1,"NAME":"name2",INFO:"info2"},
          {"ID":2,"NAME":"name3",INFO:"info3"},
        ]
        //hello.autoGenerateColumns = true;
        //hello.setDataSource(customers);
  
        let idColInfo = [
          {name:'ID',displayName:'标识列',size:70},
          {name:'NAME',displayName:'用户名',size:100},
          {name:'INFO',displayName:'信息列',size:100}
        ];
        // hello.autoGenerateColumns = false;  // 是否自动生成绑定列 是则由几列生成几列，否则为默认列
        /** 绑定表单 */
        // hello.setDataSource(customers);
        // hello.bindColumns(idColInfo); 
        /** 绑定单元格 */
        // let p = {name:'Wang feng', age: 25, sex:'male',address:{postcode:'710075'}};
        // source = new GC.Spread.Sheets.Bindings.CellBindingSource(p);
        // hello.setBindingPath(0,0,'name');
        // hello.setBindingPath(1,0,'age');
        // hello.setBindingPath(2,0,'sex');
        // hello.setBindingPath(3,0,'address.postcode');
        // hello.setDataSource(source);
        /** 绑定表格 */
        let data = {
          current:1,
          pageSize:10,
          total: 3,
          data:[
            {orderDate:'1/6/2022',item:'pencil',units: 95, cost:1.99, isMakeMoney: true},
            {orderDate:'4/6/2022',item:'binder',units: 60, cost:4.99, isMakeMoney: false},
            {orderDate:'6/8/2022',item:'pen set',units: 16, cost:15.99, isMakeMoney: false}
          ]
        };
        // let names = ['orderDate','item','units','cost'];
        // let labels = ['订单日期','清单','单位','成本'];
        // let tableColumns = [];
        // names.forEach((value,index) => {
        //   let tableColumn = new GC.Spread.Sheets.Tables.TableColumn();
        //   tableColumn.name(labels[index]);
        //   tableColumn.dataField(value);
        //   tableColumns.push(tableColumn);
        // });
        // let newTable = hello.tables.add('table1',1,1,4,4);
        // newTable.bindColumns(tableColumns);
        // newTable.bindingPath("data");
        // newTable.autoGenerateColumns(true);
        // source = new GC.Spread.Sheets.Bindings.CellBindingSource(data);
        // hello.setDataSource(source);
  
        let convert = function(item){return item['cost']+"$"}; //参数为row
        let helloTable = hello.tables.add('table1',1,0,4,6);
        let spreadNS = GC.Spread.Sheets;
        // let tableColumn1 = new spreadNS.Tables.TableColumn();
        // tableColumn1.name('订单日期');
        // tableColumn1.dataField("orderDate");
        // tableColumn1.formatter("yyyy-mm-dd");
  
        // let tableColumn2 = new spreadNS.Tables.TableColumn();
        // tableColumn2.name("清单");
        // tableColumn2.dataField("item");
  
        // let tableColumn3 = new spreadNS.Tables.TableColumn();
        // tableColumn3.name("单位");
        // tableColumn3.dataField("units");
  
        // let tableColumn4 = new spreadNS.Tables.TableColumn();
        // tableColumn4.name("成本");
        // tableColumn4.dataField("cost");
        // tableColumn4.value(convert);
  
        // let tableColumn5 = new spreadNS.Tables.TableColumn();
        // tableColumn5.name("是否赚钱");
        // tableColumn5.dataField("isMakeMoney");
        // tableColumn5.cellType(new spreadNS.CellTypes.CheckBox());
        
        // helloTable.autoGenerateColumns(false);
        // helloTable.bind([tableColumn1,tableColumn2,tableColumn3,tableColumn4,tableColumn5],'data',data); // tableColumns,bindDataField,bindData
        
        //new SpreadNS.Tables.TableColumn(第几列(从1开始),数组字段，表头名称，日期格式化字符串，列单元格类型，自定义格式化函数);
        let tableColumn1 = new spreadNS.Tables.TableColumn(1,'orderDate','日期','yyyy-mm-dd')
        let tableColumn2 = new spreadNS.Tables.TableColumn(2,'item','清单')
        let tableColumn3 = new spreadNS.Tables.TableColumn(3,'units','单位')
        let tableColumn4 = new spreadNS.Tables.TableColumn(4,'cost','成本',null,null,convert)
        let tableColumn5 = new spreadNS.Tables.TableColumn(5,'isMakeMoney','是否赚钱',null,new spreadNS.CellTypes.CheckBox())
        let button1 = new spreadNS.CellTypes.Button();
        button1.text("编辑");
        let tableColumn6 = new spreadNS.Tables.TableColumn(6,null,'操作',null,button1)
        //Bind event
        spread.bind(GC.Spread.Sheets.Events.ButtonClicked, function (e, args) {
            var sheet = args.sheet, row = args.row, col = args.col;
            var cellType = sheet.getCellType(row, col);
            if (cellType instanceof GC.Spread.Sheets.CellTypes.Button) {
                alert("Button Clicked"+ row);
            }
        });
        helloTable.autoGenerateColumns(false);
        helloTable.bind([tableColumn1,tableColumn2,tableColumn3,tableColumn4,tableColumn5,tableColumn6],'data',data)
        console.log("end");
        console.log(helloTable.getColumnValue(2))
      }
    }
  };
  </script> 
  
<style>
  .spread-host2 {
    width: 100%;
    height: 600px;
  }
</style>
