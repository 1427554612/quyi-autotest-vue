<template>
    <!-- Two-way Data-Binding -->
    <!-- <codemirror v-model="code" :options="cmOptions" /> -->
    <!-- Or manually control the data synchronization -->
    <div id="codeEditor" style="width:80%;height: 2000px;margin-top: 20px;margin-left: 10px;">
        <codemirror
            ref="cmEditor"
            :value="code"
            :options="cmOptions"
            @ready="onCmReady"
            @focus="onCmFocus"
            @input="onCmCodeChange" style="height:2000px"/>
    </div>

  </template>
  
  <script>
  
  import { codemirror } from 'vue-codemirror'
  // import base style
  import 'codemirror/lib/codemirror.css'
  // import language js
  import 'codemirror/mode/python/python.js'
  // import theme style
  import 'codemirror/theme/base16-dark.css'
  // import more 'codemirror/some-resource...'
  export default {
      name: "codemirrorDemo",
      components: {
      codemirror:codemirror
    },
    data () {
      return {
        code: "def func(): ",
        cmOptions: {
            tabSize: 4,
            mode: 'python',
            theme: 'base16-dark',
            lineNumbers: true,
            line: true,
            keymap: "sublime", // 快键键风格
            linenumbers: true, // 显示行号
            smartindent: true, // 智能缩进
            indentunit: 4, // 智能缩进单位为4个空格长度
            indentwithtabs: true, // 使用制表符进行智能缩进
        }
      }
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
      }
    },
    computed: {
      codemirror() {
        return this.$refs.cmEditor.codemirror
      }
    },
    mounted() {
      console.log('the current CodeMirror instance object:', this.codemirror)
      // you can use this.codemirror to do something...
    }
  }
  </script>
