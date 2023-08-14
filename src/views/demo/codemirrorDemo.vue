<template>
    <!-- Two-way Data-Binding -->
    <!-- <codemirror v-model="code" :options="cmOptions" /> -->
    <!-- Or manually control the data synchronization -->
    <div id="main">
        <div id="codeEditor" style="width:80%;margin-top: 20px;margin-left: 10px;">
            <codemirror 
                ref="cmEditor"
                :value="code"
                :options="cmOptions"
                @update="scriptEdit"
                @ready="onCmReady"
                @focus="onCmFocus"
                @input="onCmCodeChange" />
        </div>
        <div style="margin-top:10px">
            <el-button @click="saveCode()">保存</el-button>
        </div>
    </div>
</template>
  
<script>
  
import { codemirror } from 'vue-codemirror'
// import base style
import 'codemirror/lib/codemirror.css'
// import 'codemirror/mode/python/python.js'
require("codemirror/mode/clike/clike.js");
import 'codemirror/theme/darcula.css'
// 代码提示功能 具体语言可以从 codemirror/addon/hint/ 下引入多个
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import scriptApi from '@/api/test-script/scriptApi'
  export default {
      name: "codemirrorDemo",
      components: {
      codemirror:codemirror
    },
    data () {
      return {
        code: "",
        themes:['darcula','dracula','eclipse','erlang-dark','idea','liquibyte','mbo'],
        cmOptions: {
            tabSize: 4,            // table表格键空格数
            mode: 'text/x-java',        // 编辑语言
            theme: 'darcula',      // 主题样式
            lineNumbers: true,     // 显示行号
            line: true,
            smartIndent: true,     // 智能缩进
            indentUnit: 4,         // 智能缩进单位为4个空格长度
            keymap: "sublime",     // 快键键风格
            styleActiveLine: true, // 高亮选中行
            readOnly:false,        // 只读模式
            extraKeys: {"Ctrl": "autocomplete"},

        }
      }
    },
    mounted() {
    //   this.$refs.cmEditor.codemirror.on("inputRead", (cmEditor) => {
    //     cmEditor.showHint();
    //     });
    },
    methods: {
      onCmReady(cm) {
        console.log('the editor is readied!', cm)
      },
      onCmFocus(cm) {
        console.log('the editor is focused!', cm)
      },
      onCmCodeChange(newCode) {
        console.log('this is new code', newCode)
        this.code = newCode
      },
      onCmCodeChange(code){
        this.code = code
      },

      scriptEdit(code){
        console.log(this.code)
      },


      // 保存脚本
      saveCode(){
        console.log(this.code)
        scriptApi.run({"script":this.code}).then(response=>{
          console.log(JSON.stringify(response))
        })
      }

    },
    computed: {
      codemirror() {
        return this.$refs.cmEditor.codemirror
      }
    }

  }
  </script>

<style>
/* .CodeMirror-scroll {
    overflow: scroll !important;
    margin-bottom: 0;
    margin-right: 0;
    padding-bottom: 0;
    height: 90%;
    outline: none;
    position: relative;
    border: 1px solid #dddddd;
} */

.vue-codemirror{
    font-size : 15px;
    /* line-height : 80%; */
    text-align: left;
}
</style>

