<template>
    <div>

        <el-card class="box-card" style="width:98%;margin-left: 15px;margin-top: 10px;height: 200px;">
            <div slot="header" class="clearfix">
                <span style="font-size:20px;font-weight: bolder;">日志管理</span>
                <div>

                </div>
            </div>
        </el-card>

        <el-card class="box-card" style="width:30%;margin-left: 15px;margin-top: 10px;float: left;">
            <div slot="header" class="clearfix">
                <span style="font-size:20px;font-weight: bolder;">文件列表</span>
            </div>
            
            <div>
                <!-- 日志文件树 -->
                <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:350px"></el-input>
                <el-button  icon="el-icon-error" style="margin-left:5px" @click="filterText=''">重置</el-button>
            </div>
            
           <div>
                <el-tree class="filter-tree" :data="logTree" :props="defaultProps" 
                    default-expand-all highlight-current :filter-node-method="filterNode"  
                    ref="tree" style="margin-top:10px"  show-checkbox @node-click="findLogByFileName"
                    @check-change="handleCheckChange">
                </el-tree>
           </div>
        </el-card>

        <el-card  id="card3" class="box-card" style="width:68%;margin-top: 10px;float:right;margin-right: 17px;">
            <div slot="header" class="clearfix">
                <span style="font-size:20px;font-weight: bolder;">日志详情</span>
            </div>
            <!-- 富文本框  -->
            <el-form ref="form11" :model="testText" label-width="80px" id="table" >
                <quill-editor class="editor" ref="myTextEditor" v-model="content" :options="editorOption" 
                    @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" @change="onEditorChange($event)">
                </quill-editor>
            </el-form>
        </el-card>


    </div>
</template>

<script>
import testLogApi from '@/api/test-result/testLogApi';
export default{
    data(){
        return {
            filterText:"",
            logTree:[],
            // 富文本属性
            content: "<div><span style='color:blue'>日志......</span></div>",
            editorOption: {
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                        ["blockquote", "code-block"], // 引用  代码块
                        [{ header: 1 }, { header: 2 }], // 1、2 级标题
                        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                        [{ script: "sub" }, { script: "super" }], // 上标/下标
                        [{ indent: "-1" }, { indent: "+1" }], // 缩进
                        // [{'direction': 'rtl'}],                         // 文本方向
                        [{ size: ["small", false, "large", "huge"] }], // 字体大小
                        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                        [{ font: [] }], // 字体种类
                        [{ align: [] }], // 对齐方式
                        ["clean"], // 清除文本格式
                        ["link", "image", "video"] // 链接、图片、视频
                    ], //工具菜单栏配置
                },
            placeholder: '请在这里添加产品描述', //提示
            readyOnly: false, //是否只读
            theme: 'snow', //主题 snow/bubble
            syntax: false, //语法检测
            }
        }
    },
    // 监听
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    // 计算
    computed: {
      editor() {
        return this.$refs.myTextEditor.quillEditor;
      }
    },

    created(){
        this.initLogTree()
    },
    methods:{
        // 初始化日志文档树
        initLogTree:function(){
            testLogApi.findLogTree().then(response=>{
                this.logTree = response.data.list
                console.log(this.logTree)
            })
        },
        // 过滤节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 点击树
        findLogByFileName(logQuery){
            if(!logQuery.file){
                return
            }

            let query = {path:logQuery.path}
            testLogApi.findLog(query).then(response=>{
                this.content = response.data.data
            })
        },

        // 失去焦点
        onEditorBlur(editor) {},
      
        // 获得焦点
        onEditorFocus(editor) {},
      
        // 开始
        onEditorReady(editor) {},
      
        // 值发生变化
        onEditorChange(editor) {
            this.content = editor.html;
            console.log(editor);
        }
    }
}
</script>
<style>
.el-tree{
    height: 640px;
    font-size: 800;
}
#card3{
    height: 793px; 
}
#textarea{
    height: 700px;
}

.editor {
    line-height: normal !important;
    height: 650px;
  }
  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
  }
  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
      border-right: 0px;
      content: '保存';
      padding-right: 0px;
  }
 
  .ql-snow .ql-tooltip[data-mode=video]::before {
      content: "请输入视频地址:";
  }
 
  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
  }
 
  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
  }
 
  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }
</style>
