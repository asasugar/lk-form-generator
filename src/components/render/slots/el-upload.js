export default {
  'list-type': (h, conf, key) => {
    const list = []
    const config = conf.__config__
    if (conf['list-type'] === 'picture-card') {
      list.push(<i class="lk-icon-plus"></i>)
    } else {
      list.push(<lk-button size="small" type="primary" icon="lk-icon-upload">{config.buttonText}</lk-button>)
    }
    if (config.showTip) {
      list.push(
        <div slot="tip" class="lk-upload__tip">只能上传不超过 {config.fileSize}{config.sizeUnit} 的{conf.accept}文件</div>
      )
    }
    return list
  }
}
