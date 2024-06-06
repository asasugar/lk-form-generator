export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      if (conf.__config__.optionType === 'button') {
        list.push(<lk-checkbox-button label={item.value}>{item.label}</lk-checkbox-button>)
      } else {
        list.push(<lk-checkbox label={item.value} border={conf.border}>{item.label}</lk-checkbox>)
      }
    })
    return list
  }
}
