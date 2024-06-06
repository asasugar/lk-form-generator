import { LkLoading } from '@lucky/lucky-ui';
import loadScript from './loadScript';
import pluginsConfig from './pluginsConfig';

let tinymceObj

export default function loadTinymce(cb) {
  const { tinymceUrl } = pluginsConfig

  if (tinymceObj) {
    cb(tinymceObj)
    return
  }

  const loading = LkLoading.service({
    fullscreen: true,
    lock: true,
    text: '富文本资源加载中...',
    spinner: 'lk-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })

  loadScript(tinymceUrl, () => {
    loading.close()
    // eslint-disable-next-line no-undef
    tinymceObj = tinymce
    cb(tinymceObj)
  })
}
