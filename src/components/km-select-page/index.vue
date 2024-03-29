<template>
  <section>
    <el-select
      ref="selectPage"
      v-model="selectVal"
      v-loadmore="handleLoadMore"
      v-bind="$attrs"
      v-on="$listeners"
      @focus="handleSelectFocus"
      @clear="handleSelectClear"
      :loading="checkSelectLoad"
      :remote-method="handleRemoteSearch"
      remote
      filterable
      clearable
      style="width: 100%">
      <slot>
        <el-option v-for="(item, index) in data" :key="index" :label="item[optionLabel]" :value="item[optionValue]"></el-option>
      </slot>
      <div class="el-select-dropdown__empty">{{ isMaxPage ? '加载完毕' : '加载中...' }}</div>
    </el-select>
  </section>
</template>

<script>
export default {
  props: {
    modelName: {
      type: String,
      default: ''
    },
    data: {
      type: [Array, Object],
      default: () => []
    },
    optionLabel: {
      type: String,
      default: 'label'
    },
    optionValue: {
      type: String,
      default: 'value'
    },
    request: {
      type: Function,
      default: () => {}
    },
    isMaxPage: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal.length > 0 && this.$refs.selectPage?.multiple) {
          const unique = (arr, uniId) => {
            const res = new Map()
            return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1))
          }
          const uniqueArrObj = unique(newVal, this.optionValue)
          if (uniqueArrObj.length !== newVal.length) this.$emit('update:data', uniqueArrObj)
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      selectVal: '',
      queryParams: '',
      checkSelectLoad: false,
      currentPage: 1,
      hitOptions: [],
      isAskLoading: false
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        let scrollListener = function () {
          const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight
          if (CONDITION && this.scrollTop !== 0) binding.value()
        }
        el.unbindEventListener = () => {
          SELECTWRAP_DOM.removeEventListener('scroll', scrollListener)
        }
        SELECTWRAP_DOM.addEventListener('scroll', scrollListener)
      },
      unbind(el) {
        if (el.unbindEventListener) el.unbindEventListener()
      }
    }
  },
  mounted() {
    if (this.modelName) {
      this.handleRemoteSearch(this.modelName)
      this.selectVal = this.modelName
    }
  },
  methods: {
    handleEchoVal(val) {
      this.selectVal = val
    },
    handleSelectFocus() {
      if (!this.data.length && !this.isAskLoading) {
        this.currentPage = 1
        this.request({ page: this.currentPage })
      }
    },
    handleSelectClear() {
      this.initSelect()
      this.queryParams = ''
      this.isAskLoading = true
      this.request({ page: this.currentPage }).then(() => {
        this.isAskLoading = false
      })
    },
    handleRemoteSearch(query) {
      if (this.$refs.selectPage?.multiple) {
        this.hitOptions = this.data.filter(item => this.selectVal.includes(item[this.optionValue]))
      }
      this.$emit('update:data', this.$refs.selectPage?.multiple && this.hitOptions.length > 0 ? this.hitOptions : [])
      if (query !== this.queryParams) this.initSelect()
      this.checkSelectLoad = true
      this.queryParams = query
      this.request({ query, page: 1 }).finally(() => {
        this.checkSelectLoad = false
      })
    },
    handleLoadMore() {
      if (this.isMaxPage || this.handleLoadMore.intercept) return
      this.handleLoadMore.intercept = true
      this.currentPage++
      this.request({ query: this.queryParams, page: this.currentPage }).finally(() => {
        this.handleLoadMore.intercept = false
      })
    },
    initSelect() {
      this.currentPage = 1
      this.$emit('update:data', this.$refs.selectPage?.multiple ? this.hitOptions : [])
      this.$emit('update:isMaxPage', false)
      if (this.$refs.selectPage.$children[1].$children[0]) {
        this.$refs.selectPage.$children[1].$children[0].wrap.scrollTop = 0
      }
    }
  }
}
</script>
