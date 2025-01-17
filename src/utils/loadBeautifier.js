import { LkLoading } from '@lucky/lucky-ui';
import loadScript from './loadScript';
import pluginsConfig from './pluginsConfig';

let beautifierObj

export default function loadBeautifier(cb) {
  const { beautifierUrl } = pluginsConfig
  if (beautifierObj) {
    cb(beautifierObj)
    return
  }

  const loading = LkLoading.service({
    fullscreen: true,
    lock: true,
    text: '格式化资源加载中...',
    spinner: 'lk-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })

  loadScript(beautifierUrl, () => {
    loading.close()
    // eslint-disable-next-line no-undef
    beautifierObj = beautifier
    cb(beautifierObj)
  })
}
