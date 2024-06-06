<template>
  <div class="right-board">
    <lk-tabs v-model="currentTab" class="center-tabs">
      <lk-tab-pane label="组件属性" name="field" />
      <lk-tab-pane label="表单属性" name="form" />
    </lk-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="documentLink" title="查看组件文档">
        <i class="lk-icon-link" />
      </a>
      <lk-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <lk-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
          <lk-form-item v-if="activeData.__config__.changeTag" label="组件类型">
            <lk-select
              v-model="activeData.__config__.tagIcon"
              placeholder="请选择组件类型"
              :style="{width: '100%'}"
              @change="tagChange"
            >
              <lk-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <lk-option
                  v-for="item in group.options"
                  :key="item.__config__.label"
                  :label="item.__config__.label"
                  :value="item.__config__.tagIcon"
                >
                  <svg-icon class="node-icon" :icon-class="item.__config__.tagIcon" />
                  <span> {{ item.__config__.label }}</span>
                </lk-option>
              </lk-option-group>
            </lk-select>
          </lk-form-item>
          <lk-form-item v-if="activeData.__vModel__!==undefined" label="字段名">
            <lk-input v-model="activeData.__vModel__" placeholder="请输入字段名（v-model）" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.componentName!==undefined" label="组件名">
            {{ activeData.__config__.componentName }}
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.label!==undefined" label="标题">
            <lk-input v-model="activeData.__config__.label" placeholder="请输入标题" @input="changeRenderKey" />
          </lk-form-item>
          <lk-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
            <lk-input v-model="activeData.placeholder" placeholder="请输入占位提示" @input="changeRenderKey" />
          </lk-form-item>
          <lk-form-item v-if="activeData['start-placeholder']!==undefined" label="开始占位">
            <lk-input v-model="activeData['start-placeholder']" placeholder="请输入占位提示" />
          </lk-form-item>
          <lk-form-item v-if="activeData['end-placeholder']!==undefined" label="结束占位">
            <lk-input v-model="activeData['end-placeholder']" placeholder="请输入占位提示" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.span!==undefined" label="表单栅格">
            <lk-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.gutter!==undefined" label="栅格间隔">
            <lk-input-number v-model="activeData.gutter" :min="0" placeholder="栅格间隔" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.type!==undefined" label="布局模式">
            <lk-radio-group v-model="activeData.type">
              <lk-radio-button label="default" />
              <lk-radio-button label="flex" />
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="水平排列">
            <lk-select v-model="activeData.justify" placeholder="请选择水平排列" :style="{width: '100%'}">
              <lk-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </lk-select>
          </lk-form-item>
          <lk-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="垂直排列">
            <lk-radio-group v-model="activeData.align">
              <lk-radio-button label="top" />
              <lk-radio-button label="middle" />
              <lk-radio-button label="bottom" />
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.labelWidth!==undefined" label="标签宽度">
            <lk-input v-model.number="activeData.__config__.labelWidth" type="number" placeholder="请输入标签宽度" />
          </lk-form-item>
          <lk-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="组件宽度">
            <lk-input v-model="activeData.style.width" placeholder="请输入组件宽度" clearable />
          </lk-form-item>
          <lk-form-item v-if="activeData.__vModel__!==undefined" label="默认值">
            <lk-input
              :value="setDefaultValue(activeData.__config__.defaultValue)"
              placeholder="请输入默认值"
              @input="onDefaultValueInput"
            />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag==='lk-checkbox-group'" label="至少应选">
            <lk-input-number
              :value="activeData.min"
              :min="0"
              placeholder="至少应选"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag==='lk-checkbox-group'" label="最多可选">
            <lk-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最多可选"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </lk-form-item>
          <lk-form-item v-if="activeData.__slot__&&activeData.__slot__.prepend!==undefined" label="前缀">
            <lk-input v-model="activeData.__slot__.prepend" placeholder="请输入前缀" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__slot__&&activeData.__slot__.append!==undefined" label="后缀">
            <lk-input v-model="activeData.__slot__.append" placeholder="请输入后缀" />
          </lk-form-item>
          <lk-form-item v-if="activeData['prefix-icon']!==undefined" label="前图标">
            <lk-input v-model="activeData['prefix-icon']" placeholder="请输入前图标名称">
              <lk-button slot="append" icon="lk-icon-thumb" @click="openIconsDialog('prefix-icon')">
                选择
              </lk-button>
            </lk-input>
          </lk-form-item>
          <lk-form-item v-if="activeData['suffix-icon'] !== undefined" label="后图标">
            <lk-input v-model="activeData['suffix-icon']" placeholder="请输入后图标名称">
              <lk-button slot="append" icon="lk-icon-thumb" @click="openIconsDialog('suffix-icon')">
                选择
              </lk-button>
            </lk-input>
          </lk-form-item>
          <lk-form-item
            v-if="activeData['icon']!==undefined && activeData.__config__.tag === 'lk-button'"
            label="按钮图标"
          >
            <lk-input v-model="activeData['icon']" placeholder="请输入按钮图标名称">
              <lk-button slot="append" icon="lk-icon-thumb" @click="openIconsDialog('icon')">
                选择
              </lk-button>
            </lk-input>
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-cascader'" label="选项分隔符">
            <lk-input v-model="activeData.separator" placeholder="请输入选项分隔符" />
          </lk-form-item>
          <lk-form-item v-if="activeData.autosize !== undefined" label="最小行数">
            <lk-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="最小行数" />
          </lk-form-item>
          <lk-form-item v-if="activeData.autosize !== undefined" label="最大行数">
            <lk-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="最大行数" />
          </lk-form-item>
          <lk-form-item v-if="isShowMin" label="最小值">
            <lk-input-number v-model="activeData.min" placeholder="最小值" />
          </lk-form-item>
          <lk-form-item v-if="isShowMax" label="最大值">
            <lk-input-number v-model="activeData.max" placeholder="最大值" />
          </lk-form-item>
          <lk-form-item v-if="activeData.height!==undefined" label="组件高度">
            <lk-input-number v-model="activeData.height" placeholder="高度" @input="changeRenderKey" />
          </lk-form-item>
          <lk-form-item v-if="isShowStep" label="步长">
            <lk-input-number v-model="activeData.step" placeholder="步数" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-input-number'" label="精度">
            <lk-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-input-number'" label="按钮位置">
            <lk-radio-group v-model="activeData['controls-position']">
              <lk-radio-button label="">
                默认
              </lk-radio-button>
              <lk-radio-button label="right">
                右侧
              </lk-radio-button>
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item v-if="activeData.maxlength !== undefined" label="最多输入">
            <lk-input v-model="activeData.maxlength" placeholder="请输入字符长度">
              <template slot="append">
                个字符
              </template>
            </lk-input>
          </lk-form-item>
          <lk-form-item v-if="activeData['active-text'] !== undefined" label="开启提示">
            <lk-input v-model="activeData['active-text']" placeholder="请输入开启提示" />
          </lk-form-item>
          <lk-form-item v-if="activeData['inactive-text'] !== undefined" label="关闭提示">
            <lk-input v-model="activeData['inactive-text']" placeholder="请输入关闭提示" />
          </lk-form-item>
          <lk-form-item v-if="activeData['active-value'] !== undefined" label="开启值">
            <lk-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="请输入开启值"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </lk-form-item>
          <lk-form-item v-if="activeData['inactive-value'] !== undefined" label="关闭值">
            <lk-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="请输入关闭值"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </lk-form-item>
          <lk-form-item
            v-if="activeData.type !== undefined && 'lk-date-picker' === activeData.__config__.tag"
            label="时间类型"
          >
            <lk-select
              v-model="activeData.type"
              placeholder="请选择时间类型"
              :style="{ width: '100%' }"
              @change="dateTypeChange"
            >
              <lk-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </lk-select>
          </lk-form-item>
          <lk-form-item v-if="activeData.name !== undefined" label="文件字段名">
            <lk-input v-model="activeData.name" placeholder="请输入上传文件字段名" />
          </lk-form-item>
          <lk-form-item v-if="activeData.accept !== undefined" label="文件类型">
            <lk-select
              v-model="activeData.accept"
              placeholder="请选择文件类型"
              :style="{ width: '100%' }"
              clearable
            >
              <lk-option label="图片" value="image/*" />
              <lk-option label="视频" value="video/*" />
              <lk-option label="音频" value="audio/*" />
              <lk-option label="excel" value=".xls,.xlsx" />
              <lk-option label="word" value=".doc,.docx" />
              <lk-option label="pdf" value=".pdf" />
              <lk-option label="txt" value=".txt" />
            </lk-select>
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.fileSize !== undefined" label="文件大小">
            <lk-input v-model.number="activeData.__config__.fileSize" placeholder="请输入文件大小">
              <lk-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
                <lk-option label="KB" value="KB" />
                <lk-option label="MB" value="MB" />
                <lk-option label="GB" value="GB" />
              </lk-select>
            </lk-input>
          </lk-form-item>
          <lk-form-item v-if="activeData.action !== undefined" label="上传地址">
            <lk-input v-model="activeData.action" placeholder="请输入上传地址" clearable />
          </lk-form-item>
          <lk-form-item v-if="activeData['list-type'] !== undefined" label="列表类型">
            <lk-radio-group v-model="activeData['list-type']" size="small">
              <lk-radio-button label="text">
                text
              </lk-radio-button>
              <lk-radio-button label="picture">
                picture
              </lk-radio-button>
              <lk-radio-button label="picture-card">
                picture-card
              </lk-radio-button>
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item
            v-if="activeData.type !== undefined && activeData.__config__.tag === 'lk-button'"
            label="按钮类型"
          >
            <lk-select v-model="activeData.type" :style="{ width: '100%' }">
              <lk-option label="primary" value="primary" />
              <lk-option label="success" value="success" />
              <lk-option label="warning" value="warning" />
              <lk-option label="danger" value="danger" />
              <lk-option label="info" value="info" />
              <lk-option label="text" value="text" />
            </lk-select>
          </lk-form-item>
          <lk-form-item
            v-if="activeData.__config__.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="按钮文字"
          >
            <lk-input v-model="activeData.__config__.buttonText" placeholder="请输入按钮文字" />
          </lk-form-item>
          <lk-form-item
            v-if="activeData.__config__.tag === 'lk-button'"
            label="按钮文字"
          >
            <lk-input v-model="activeData.__slot__.default" placeholder="请输入按钮文字" />
          </lk-form-item>
          <lk-form-item v-if="activeData['range-separator'] !== undefined" label="分隔符">
            <lk-input v-model="activeData['range-separator']" placeholder="请输入分隔符" />
          </lk-form-item>
          <lk-form-item v-if="activeData['picker-options'] !== undefined" label="时间段">
            <lk-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="请输入时间段"
            />
          </lk-form-item>
          <lk-form-item v-if="activeData.format !== undefined" label="时间格式">
            <lk-input
              :value="activeData.format"
              placeholder="请输入时间格式"
              @input="setTimeValue($event)"
            />
          </lk-form-item>
          <template v-if="['lk-checkbox-group', 'lk-radio-group', 'lk-select'].indexOf(activeData.__config__.tag) > -1">
            <lk-divider>选项</lk-divider>
            <draggable
              :list="activeData.__slot__.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="lk-icon-s-operation" />
                </div>
                <lk-input v-model="item.label" placeholder="选项名" size="small" />
                <lk-input
                  placeholder="选项值"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                />
                <div class="close-btn select-line-icon" @click="activeData.__slot__.options.splice(index, 1)">
                  <i class="lk-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <lk-button
                style="padding-bottom: 0"
                icon="lk-icon-circle-plus-outline"
                type="text"
                @click="addSelectItem"
              >
                添加选项
              </lk-button>
            </div>
            <lk-divider />
          </template>

          <template v-if="['lk-cascader', 'lk-table'].includes(activeData.__config__.tag)">
            <lk-divider>选项</lk-divider>
            <lk-form-item v-if="activeData.__config__.dataType" label="数据类型">
              <lk-radio-group v-model="activeData.__config__.dataType" size="small">
                <lk-radio-button label="dynamic">
                  动态数据
                </lk-radio-button>
                <lk-radio-button label="static">
                  静态数据
                </lk-radio-button>
              </lk-radio-group>
            </lk-form-item>

            <template v-if="activeData.__config__.dataType === 'dynamic'">
              <lk-form-item label="接口地址">
                <lk-input
                  v-model="activeData.__config__.url"
                  :title="activeData.__config__.url"
                  placeholder="请输入接口地址"
                  clearable
                  @blur="$emit('fetch-data', activeData)"
                >
                  <lk-select
                    slot="prepend"
                    v-model="activeData.__config__.method"
                    :style="{width: '85px'}"
                    @change="$emit('fetch-data', activeData)"
                  >
                    <lk-option label="get" value="get" />
                    <lk-option label="post" value="post" />
                    <lk-option label="put" value="put" />
                    <lk-option label="delete" value="delete" />
                  </lk-select>
                </lk-input>
              </lk-form-item>
              <lk-form-item label="数据位置">
                <lk-input
                  v-model="activeData.__config__.dataPath"
                  placeholder="请输入数据位置"
                  @blur="$emit('fetch-data', activeData)"
                />
              </lk-form-item>

              <template v-if="activeData.props && activeData.props.props">
                <lk-form-item label="标签键名">
                  <lk-input v-model="activeData.props.props.label" placeholder="请输入标签键名" />
                </lk-form-item>
                <lk-form-item label="值键名">
                  <lk-input v-model="activeData.props.props.value" placeholder="请输入值键名" />
                </lk-form-item>
                <lk-form-item label="子级键名">
                  <lk-input v-model="activeData.props.props.children" placeholder="请输入子级键名" />
                </lk-form-item>
              </template>
            </template>

            <!-- 级联选择静态树 -->
            <lk-tree
              v-if="activeData.__config__.dataType === 'static'"
              draggable
              :data="activeData.options"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
            <div v-if="activeData.__config__.dataType === 'static'" style="margin-left: 20px">
              <lk-button
                style="padding-bottom: 0"
                icon="lk-icon-circle-plus-outline"
                type="text"
                @click="addTreeItem"
              >
                添加父级
              </lk-button>
            </div>
            <lk-divider />
          </template>

          <lk-form-item v-if="activeData.__config__.optionType !== undefined" label="选项样式">
            <lk-radio-group v-model="activeData.__config__.optionType">
              <lk-radio-button label="default">
                默认
              </lk-radio-button>
              <lk-radio-button label="button">
                按钮
              </lk-radio-button>
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item v-if="activeData['active-color'] !== undefined" label="开启颜色">
            <lk-color-picker v-model="activeData['active-color']" />
          </lk-form-item>
          <lk-form-item v-if="activeData['inactive-color'] !== undefined" label="关闭颜色">
            <lk-color-picker v-model="activeData['inactive-color']" />
          </lk-form-item>

          <lk-form-item v-if="activeData.__config__.showLabel !== undefined
            && activeData.__config__.labelWidth !== undefined" label="显示标签"
          >
            <lk-switch v-model="activeData.__config__.showLabel" />
          </lk-form-item>
          <lk-form-item v-if="activeData.branding !== undefined" label="品牌烙印">
            <lk-switch v-model="activeData.branding" @input="changeRenderKey" />
          </lk-form-item>
          <lk-form-item v-if="activeData['allow-half'] !== undefined" label="允许半选">
            <lk-switch v-model="activeData['allow-half']" />
          </lk-form-item>
          <lk-form-item v-if="activeData['show-text'] !== undefined" label="辅助文字">
            <lk-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </lk-form-item>
          <lk-form-item v-if="activeData['show-score'] !== undefined" label="显示分数">
            <lk-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </lk-form-item>
          <lk-form-item v-if="activeData['show-stops'] !== undefined" label="显示间断点">
            <lk-switch v-model="activeData['show-stops']" />
          </lk-form-item>
          <lk-form-item v-if="activeData.range !== undefined" label="范围选择">
            <lk-switch v-model="activeData.range" @change="rangeChange" />
          </lk-form-item>
          <lk-form-item
            v-if="activeData.__config__.border !== undefined && activeData.__config__.optionType === 'default'"
            label="是否带边框"
          >
            <lk-switch v-model="activeData.__config__.border" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-color-picker'" label="颜色格式">
            <lk-select
              v-model="activeData['color-format']"
              placeholder="请选择颜色格式"
              :style="{ width: '100%' }"
              clearable
              @change="colorFormatChange"
            >
              <lk-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </lk-select>
          </lk-form-item>
          <lk-form-item
            v-if="activeData.size !== undefined &&
              (activeData.__config__.optionType === 'button' ||
                activeData.__config__.border ||
                activeData.__config__.tag === 'lk-color-picker' ||
                activeData.__config__.tag === 'lk-button')"
            label="组件尺寸"
          >
            <lk-radio-group v-model="activeData.size">
              <lk-radio-button label="medium">
                中等
              </lk-radio-button>
              <lk-radio-button label="small">
                较小
              </lk-radio-button>
              <lk-radio-button label="mini">
                迷你
              </lk-radio-button>
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item v-if="activeData['show-word-limit'] !== undefined" label="输入统计">
            <lk-switch v-model="activeData['show-word-limit']" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-input-number'" label="严格步数">
            <lk-switch v-model="activeData['step-strictly']" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-cascader'" label="任选层级">
            <lk-switch v-model="activeData.props.props.checkStrictly" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-cascader'" label="是否多选">
            <lk-switch v-model="activeData.props.props.multiple" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-cascader'" label="展示全路径">
            <lk-switch v-model="activeData['show-all-levels']" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-cascader'" label="可否筛选">
            <lk-switch v-model="activeData.filterable" />
          </lk-form-item>
          <lk-form-item v-if="activeData.clearable !== undefined" label="能否清空">
            <lk-switch v-model="activeData.clearable" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.showTip !== undefined" label="显示提示">
            <lk-switch v-model="activeData.__config__.showTip" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-upload'" label="多选文件">
            <lk-switch v-model="activeData.multiple" />
          </lk-form-item>
          <lk-form-item v-if="activeData['auto-upload'] !== undefined" label="自动上传">
            <lk-switch v-model="activeData['auto-upload']" />
          </lk-form-item>
          <lk-form-item v-if="activeData.readonly !== undefined" label="是否只读">
            <lk-switch v-model="activeData.readonly" />
          </lk-form-item>
          <lk-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
            <lk-switch v-model="activeData.disabled" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-select'" label="能否搜索">
            <lk-switch v-model="activeData.filterable" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.tag === 'lk-select'" label="是否多选">
            <lk-switch v-model="activeData.multiple" @change="multipleChange" />
          </lk-form-item>
          <lk-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
            <lk-switch v-model="activeData.__config__.required" />
          </lk-form-item>

          <template v-if="activeData.__config__.layoutTree">
            <lk-divider>布局结构树</lk-divider>
            <lk-tree
              :data="[activeData.__config__]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :icon-class="data.__config__?data.__config__.tagIcon:data.tagIcon" />
                  {{ node.label }}
                </span>
              </span>
            </lk-tree>
          </template>

          <template v-if="Array.isArray(activeData.__config__.regList)">
            <lk-divider>正则校验</lk-divider>
            <div
              v-for="(item, index) in activeData.__config__.regList"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                <i class="lk-icon-close" />
              </span>
              <lk-form-item label="表达式">
                <lk-input v-model="item.pattern" placeholder="请输入正则" />
              </lk-form-item>
              <lk-form-item label="错误提示" style="margin-bottom:0">
                <lk-input v-model="item.message" placeholder="请输入错误提示" />
              </lk-form-item>
            </div>
            <div style="margin-left: 20px">
              <lk-button icon="lk-icon-circle-plus-outline" type="text" @click="addReg">
                添加规则
              </lk-button>
            </div>
          </template>
        </lk-form>
        <!-- 表单属性 -->
        <lk-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <lk-form-item label="表单名">
            <lk-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
          </lk-form-item>
          <lk-form-item label="表单模型">
            <lk-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </lk-form-item>
          <lk-form-item label="校验模型">
            <lk-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </lk-form-item>
          <lk-form-item label="表单尺寸">
            <lk-radio-group v-model="formConf.size">
              <lk-radio-button label="medium">
                中等
              </lk-radio-button>
              <lk-radio-button label="small">
                较小
              </lk-radio-button>
              <lk-radio-button label="mini">
                迷你
              </lk-radio-button>
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item label="标签对齐">
            <lk-radio-group v-model="formConf.labelPosition">
              <lk-radio-button label="left">
                左对齐
              </lk-radio-button>
              <lk-radio-button label="right">
                右对齐
              </lk-radio-button>
              <lk-radio-button label="top">
                顶部对齐
              </lk-radio-button>
            </lk-radio-group>
          </lk-form-item>
          <lk-form-item label="标签宽度">
            <lk-input v-model.number="formConf.labelWidth" type="number" placeholder="请输入标签宽度" />
          </lk-form-item>
          <lk-form-item label="栅格间隔">
            <lk-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </lk-form-item>
          <lk-form-item label="禁用表单">
            <lk-switch v-model="formConf.disabled" />
          </lk-form-item>
          <lk-form-item label="表单按钮">
            <lk-switch v-model="formConf.formBtns" />
          </lk-form-item>
          <lk-form-item label="显示未选中组件边框">
            <lk-switch v-model="formConf.unFocusedComponentBorder" />
          </lk-form-item>
        </lk-form>
      </lk-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
  </div>
</template>

<script>
import { isArray } from 'util'
import TreeNodeDialog from '@/views/index/TreeNodeDialog'
import { isNumberStr } from '@/utils/index'
import IconsDialog from './IconsDialog'
import {
  inputComponents, selectComponents, layoutComponents
} from '@/components/generator/config'
import { saveFormConf } from '@/utils/db'

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ['tinymce']

export default {
  components: {
    TreeNodeDialog,
    IconsDialog
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        {
          label: '周(week)',
          value: 'week'
        },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        {
          label: '月范围(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__
          return data.componentName || `${config.label}: ${data.__vModel__}`
        }
      }
    }
  },
  computed: {
    documentLink() {
      return (
        this.activeData.__config__.document
        || 'https://element.eleme.cn/#/zh-CN/component/installation'
      )
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined
        && this.activeData.__config__.tag === 'lk-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: '输入型组件',
          options: inputComponents
        },
        {
          label: '选择型组件',
          options: selectComponents
        }
      ]
    },
    activeTag() {
      return this.activeData.__config__.tag
    },
    isShowMin() {
      return ['lk-input-number', 'lk-slider'].indexOf(this.activeTag) > -1
    },
    isShowMax() {
      return ['lk-input-number', 'lk-slider', 'lk-rate'].indexOf(this.activeTag) > -1
    },
    isShowStep() {
      return ['lk-input-number', 'lk-slider'].indexOf(this.activeTag) > -1
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val)
      },
      deep: true
    }
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
              class="lk-icon-plus"
              title="添加"
            ></i>
            <i on-click={() => this.remove(node, data)}
              class="lk-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData.__config__, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.__config__.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.__config__.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .lk-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .lk-input + .lk-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .lk-date-editor {
    width: 227px;
  }
  ::v-deep .lk-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>
