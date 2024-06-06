<template>
  <div>
    <lk-dialog
      v-bind="$attrs"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
    >
      <lk-row :gutter="0">
        <lk-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="small"
          label-width="100px"
        >
          <lk-col :span="24">
            <lk-form-item
              label="选项名"
              prop="label"
            >
              <lk-input
                v-model="formData.label"
                placeholder="请输入选项名"
                clearable
              />
            </lk-form-item>
          </lk-col>
          <lk-col :span="24">
            <lk-form-item
              label="选项值"
              prop="value"
            >
              <lk-input
                v-model="formData.value"
                placeholder="请输入选项值"
                clearable
              >
                <lk-select
                  slot="append"
                  v-model="dataType"
                  :style="{width: '100px'}"
                >
                  <lk-option
                    v-for="(item, index) in dataTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </lk-select>
              </lk-input>
            </lk-form-item>
          </lk-col>
        </lk-form>
      </lk-row>
      <div slot="footer">
        <lk-button
          type="primary"
          @click="handelConfirm"
        >
          确定
        </lk-button>
        <lk-button @click="close">
          取消
        </lk-button>
      </div>
    </lk-dialog>
  </div>
</template>
<script>
import { isNumberStr } from '@/utils/index'
import { getTreeNodeId, saveTreeNodeId } from '@/utils/db'

const id = getTreeNodeId()

export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      id,
      formData: {
        label: undefined,
        value: undefined
      },
      rules: {
        label: [
          {
            required: true,
            message: '请输入选项名',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '请输入选项值',
            trigger: 'blur'
          }
        ]
      },
      dataType: 'string',
      dataTypeOptions: [
        {
          label: '字符串',
          value: 'string'
        },
        {
          label: '数字',
          value: 'number'
        }
      ]
    }
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    'formData.value': function (val) {
      this.dataType = isNumberStr(val) ? 'number' : 'string'
    },
    id(val) {
      saveTreeNodeId(val)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.formData = {
        label: undefined,
        value: undefined
      }
    },
    onClose() {},
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        if (this.dataType === 'number') {
          this.formData.value = parseFloat(this.formData.value)
        }
        this.formData.id = this.id++
        this.$emit('commit', this.formData)
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
