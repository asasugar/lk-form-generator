<template>
  <div>
    <lk-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div style="height:100%">
        <lk-row style="height:100%;overflow:auto">
          <lk-col :md="24" :lg="12" class="left-editor">
            <div class="setting" title="资源引用" @click="showResource">
              <lk-badge :is-dot="!!resources.length" class="item">
                <i class="lk-icon-setting" />
              </lk-badge>
            </div>
            <lk-tabs v-model="activeTab" type="card" class="editor-tabs">
              <lk-tab-pane name="html">
                <span slot="label">
                  <i v-if="activeTab==='html'" class="lk-icon-edit" />
                  <i v-else class="lk-icon-document" />
                  template
                </span>
              </lk-tab-pane>
              <lk-tab-pane name="js">
                <span slot="label">
                  <i v-if="activeTab==='js'" class="lk-icon-edit" />
                  <i v-else class="lk-icon-document" />
                  script
                </span>
              </lk-tab-pane>
              <lk-tab-pane name="css">
                <span slot="label">
                  <i v-if="activeTab==='css'" class="lk-icon-edit" />
                  <i v-else class="lk-icon-document" />
                  css
                </span>
              </lk-tab-pane>
            </lk-tabs>
            <div v-show="activeTab==='html'" id="editorHtml" class="tab-editor" />
            <div v-show="activeTab==='js'" id="editorJs" class="tab-editor" />
            <div v-show="activeTab==='css'" id="editorCss" class="tab-editor" />
          </lk-col>
          <lk-col :md="24" :lg="12" class="right-preview">
            <div class="action-bar" :style="{'text-align': 'left'}">
              <span class="bar-btn" @click="runCode">
                <i class="lk-icon-refresh" />
                刷新
              </span>
              <span class="bar-btn" @click="exportFile">
                <i class="lk-icon-download" />
                导出vue文件
              </span>
              <span ref="copyBtn" class="bar-btn copy-btn">
                <i class="lk-icon-document-copy" />
                复制代码
              </span>
              <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
                <i class="lk-icon-circle-close" />
                关闭
              </span>
            </div>
            <iframe
              v-show="isIframeLoaded"
              ref="previewPage"
              class="result-wrapper"
              frameborder="0"
              src="preview.html"
              @load="iframeLoad"
            />
            <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
          </lk-col>
        </lk-row>
      </div>
    </lk-drawer>
    <resource-dialog
      :visible.sync="resourceVisible"
      :origin-resource="resources"
      @save="setResource"
    />
  </div>
</template>
<script>
import { parse } from '@babel/parser'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import { exportDefault, beautifierConf, titleCase } from '@/utils/index'
import ResourceDialog from './ResourceDialog'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'

const editorObj = {
  html: null,
  js: null,
  css: null
}
const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
}
let beautifier
let monaco

export default {
  components: { ResourceDialog },
  props: ['formData', 'generateConf'],
  data() {
    return {
      activeTab: 'html',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      codeFrame: '',
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      resourceVisible: false,
      scripts: [],
      links: [],
      monaco: null
    }
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links)
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    const clipboard = new ClipboardJS('.copy-btn', {
      text: trigger => {
        const codeStr = this.generateCode()
        this.$notify({
          title: '成功',
          message: '代码已复制到剪切板，可粘贴。',
          type: 'success'
        })
        return codeStr
      }
    })
    clipboard.on('error', e => {
      this.$message.error('代码复制失败')
    })
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    onOpen() {
      const { type } = this.generateConf
      this.htmlCode = makeUpHtml(this.formData, type)
      this.jsCode = makeUpJs(this.formData, type)
      this.cssCode = makeUpCss(this.formData)

      loadBeautifier(btf => {
        beautifier = btf
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)

        loadMonaco(val => {
          monaco = val
          this.setEditorValue('editorHtml', 'html', this.htmlCode)
          this.setEditorValue('editorJs', 'js', this.jsCode)
          this.setEditorValue('editorCss', 'css', this.cssCode)
          if (!this.isInitcode) {
            this.isRefreshCode = true
            this.isIframeLoaded && (this.isInitcode = true) && this.runCode()
          }
        })
      })
    },
    onClose() {
      this.isInitcode = false
      this.isRefreshCode = false
    },
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true
        this.isRefreshCode && (this.isInitcode = true) && this.runCode()
      }
    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr)
      } else {
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: mode[type],
          automaticLayout: true
        })
      }
      // ctrl + s 刷新
      editorObj[type].onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode()
        }
      })
    },
    runCode() {
      const jsCodeStr = editorObj.js.getValue()
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' })
        const astBody = ast.program.body
        if (astBody.length > 1) {
          this.$confirm(
            'js格式不能识别，仅支持修改export default的对象内容',
            '提示',
            {
              type: 'warning'
            }
          )
          return
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: editorObj.html.getValue(),
              js: jsCodeStr.replace(exportDefault, ''),
              css: editorObj.css.getValue(),
              scripts: this.scripts,
              links: this.links
            }
          }

          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          )
        } else {
          this.$message.error('请使用export default')
        }
      } catch (err) {
        this.$message.error(`js错误：${err}`)
        console.error(err)
      }
    },
    generateCode() {
      const html = vueTemplate(editorObj.html.getValue())
      const script = vueScript(editorObj.js.getValue())
      const css = cssStyle(editorObj.css.getValue())
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    exportFile() {
      this.$prompt('文件名:', '导出文件', {
        inputValue: `${+new Date()}.vue`,
        closeOnClickModal: false,
        inputPlaceholder: '请输入文件名'
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.vue`
        const codeStr = this.generateCode()
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, value)
      })
    },
    showResource() {
      this.resourceVisible = true
    },
    setResource(arr) {
      const scripts = []; const
        links = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.endsWith('.css')) {
            links.push(item)
          } else {
            scripts.push(item)
          }
        })
        this.scripts = scripts
        this.links = links
      } else {
        this.scripts = []
        this.links = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/mixin.less';

.tab-editor {
  position: absolute;
  top: 33px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}
.setting{
  position: absolute;
  right: 15px;
  top: 3px;
  color: #a9f122;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}
.right-preview {
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
.actionBar();
::v-deep .lk-drawer__header {
  display: none;
}
</style>
