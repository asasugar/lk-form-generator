import { LkLoading } from '@lucky/lucky-ui';
import loadScript from './loadScript';
import pluginsConfig from './pluginsConfig';

// monaco-editor单例
let monacoEidtor

/**
 * 动态加载monaco-editor cdn资源
 * @param {Function} cb 回调，必填
 */
export default function loadMonaco(cb) {
  if (monacoEidtor) {
    cb(monacoEidtor)
    return
  }

  const { monacoEditorUrl: vs } = pluginsConfig

  // 使用element ui实现加载提示
  const loading = LkLoading.service({
    fullscreen: true,
    lock: true,
    text: '编辑器资源初始化中...',
    spinner: 'lk-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })

  !window.require && (window.require = {})
  !window.require.paths && (window.require.paths = {})
  window.require.paths.vs = vs

  loadScript(`${vs}/loader.js`, () => {
    window.require(['vs/editor/editor.main'], () => {
      loading.close()
      monacoEidtor = window.monaco
      cb(monacoEidtor)
    })
  })
}
