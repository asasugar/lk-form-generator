export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      list.push(<lk-option label={item.label} value={item.value} disabled={item.disabled}></lk-option>)
    })
    return list
  }
}
