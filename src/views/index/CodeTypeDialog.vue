<template>
  <div>
    <lk-dialog
      v-bind="$attrs"
      width="500px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
    >
      <lk-row :gutter="15">
        <lk-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <lk-col :span="24">
            <lk-form-item label="生成类型" prop="type">
              <lk-radio-group v-model="formData.type">
                <lk-radio-button
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                >
                  {{ item.label }}
                </lk-radio-button>
              </lk-radio-group>
            </lk-form-item>
            <lk-form-item v-if="showFileName" label="文件名" prop="fileName">
              <lk-input v-model="formData.fileName" placeholder="请输入文件名" clearable />
            </lk-form-item>
          </lk-col>
        </lk-form>
      </lk-row>

      <div slot="footer">
        <lk-button @click="close">
          取消
        </lk-button>
        <lk-button type="primary" @click="handelConfirm">
          确定
        </lk-button>
      </div>
    </lk-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ['showFileName'],
  data() {
    return {
      formData: {
        fileName: undefined,
        type: 'file'
      },
      rules: {
        fileName: [{
          required: true,
          message: '请输入文件名',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '生成类型不能为空',
          trigger: 'change'
        }]
      },
      typeOptions: [{
        label: '页面',
        value: 'file'
      }, {
        label: '弹窗',
        value: 'dialog'
      }]
    }
  },
  computed: {
  },
  watch: {},
  mounted() {},
  methods: {
    onOpen() {
      if (this.showFileName) {
        this.formData.fileName = `${+new Date()}.vue`
      }
    },
    onClose() {
    },
    close(e) {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        this.$emit('confirm', { ...this.formData })
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
