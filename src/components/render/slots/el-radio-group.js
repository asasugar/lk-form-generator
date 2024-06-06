export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      if (conf.__config__.optionType === 'button') {
        list.push(<lk-radio-button label={item.value}>{item.label}</lk-radio-button>)
      } else {
        list.push(<lk-radio label={item.value} border={conf.border}>{item.label}</lk-radio>)
      }
    })
    return list
  }
}
