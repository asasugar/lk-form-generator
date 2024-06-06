/**
 * 用于生成表单校验，指定正则规则的触发方式。
 * 未在此处声明无触发方式的组件将不生成rule！！
 */
export default {
  'lk-input': 'blur',
  'lk-input-number': 'blur',
  'lk-select': 'change',
  'lk-radio-group': 'change',
  'lk-checkbox-group': 'change',
  'lk-cascader': 'change',
  'lk-time-picker': 'change',
  'lk-date-picker': 'change',
  'lk-rate': 'change',
  tinymce: 'blur'
}
