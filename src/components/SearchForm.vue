<template>
  <div>
    <el-form :inline="true" class="search-form-inline">
        <el-form-item>
          <el-input placeholder="请输入查询条件" v-model="keyword"></el-input>
        </el-form-item>
        <el-button type="primary" @click="multifieldSearch">{{ $t('search')}}</el-button>
      </el-form>
      <!--高级搜索popover-->
      <el-popover
        ref="advancedSearchPopover"
        trigger="click"
        v-model="showAdvancedSearchPopover">
      <el-form :inline="true" class="adv-earch-form-inline">
        <el-col :span="24" v-for="(item, i) in clauses" v-bind:key="i">
          <!-- clause item -->
          <el-form-item>
            <el-select clearable v-model="item.bool">
              <el-option v-for="b in essearch.bool" :key="b.value" :label="b.label" :value="b.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="item.field">
              <el-option v-for="f in essearch.fields" :key="f.value" :label="f.label" :value="f.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="item.op">
              <el-option v-for="option in essearch.op" :label="option.label" :value="option.value" :key="option.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="item.op !== 'range'">
            <el-input v-model="item.value"></el-input>
          </el-form-item>
          <!--range-->
          <div v-show="item.op === 'range'">
            <el-form-item>
              <el-select v-model="item.range.start" clearable>
                <el-option :label="essearch.range.gt" value="gt"></el-option>
                <el-option :label="essearch.range.gte" value="gte"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="item.range.startValue"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="item.range.end" clearable>
                <el-option :label="essearch.range.lt" value="lt"></el-option>
                <el-option :label="essearch.range.lte" value="lte"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="item.range.endValue"></el-input>
            </el-form-item>
          </div>
          <!--range-->
          <el-form-item>
            <el-button size="mini" icon="plus" @click="newClause"></el-button>
            <el-button size="mini" icon="minus" @click="removeClause(i)"></el-button>
          </el-form-item>
        </el-col>
        <el-button size="mini" type="primary" icon="search" @click="onSearch">{{ $t('search-advance')}}</el-button>
        <el-button type="text" @click="showAdvancedSearchPopover = false">{{ $t('cancel')}}</el-button>
      </el-form>
      </el-popover>
      <!--Elashsearch form-->
        <el-button type="text" icon="menu" v-popover:advancedSearchPopover size="mini">{{ $t('search-advance')}}</el-button>
      <!--Elashsearch advance form-->
  </div>
</template>
<script>
// import { indexOfArrayObject } from '../utils/util.js'
const clause = {
  field: '',
  op: '',
  value: '',
  bool: '',
  range: {
    start: '',
    end: '',
    startValue: '',
    endValue: ''
  },
  keyword: ''
}
const orginQuery = function () {
  return {
    query: {
      bool: {
        must: [],
        must_not: [], // es field name don't modify
        should: []
      }
    }
  }
}
// Object.defineProperty(Array.prototype, 'unique', { enumerable: false, configurable: true })
export default {
  props: {
    essearch: {
      fields: Array,
      default: () => []
    }
  },
  // Elasticsearch Form
  name: 'SearchForm',
  data () {
    return {
      keyword: '',
      clauses: [Object.assign({}, clause)],
      showAdvancedSearchPopover: false
    }
  },
  methods: {
    multifieldSearch () {
      const queryRequest = { query: {}}
      const multiMatch = {}
      multiMatch['query'] = this.keyword
      multiMatch['type'] = 'cross_fields'
      multiMatch['fields'] = [...(this.essearch.fields.map(i => i.value))]
      queryRequest.query['multi_match'] = multiMatch
      this.$emit('essearch', queryRequest)
    },
    onSearch () {
      const queryRequest = orginQuery()
      this.clauses.map(q => {
        const { bool } = q
        const clause = this.addClause(q)
        const param = queryRequest.query.bool[bool]
        // if (indexOfArrayObject(param, clause, field) === -1) {
        param && param.push(clause)
        // }
      })
      this.$emit('essearch', queryRequest)
    },
    removeClause (index) {
      this.clauses.splice(index, 1)
      if (this.clauses.length === 0) {
        this.clauses.push(Object.assign({}, clause))
        // this.advance = false
      }
    },
    newClause () {
      this.clauses.push(Object.assign({}, clause))
    },
    addClause ({ value, field, op, bool, range }) {
      bool = bool || 'should'
      op = op || 'match_all'
      field = field || '_all'

      if (op === 'range') {
        const value = {}
        if (range.start) {
          value[range.start] = range.startValue
        }
        if (range.end) {
          value[range.end] = range.endValue
        }
        return this.setClause(value, field, 'range', 'must')
      }

      return this.setClause(value, field, op, bool, range)
    },
    setClause (value, field, op, bool, range) {
      const clause = {}
      const query = {}
      if (op === 'match_all') {
      } else if (op === 'query_string') {
        query['default_field'] = field
        query['query'] = value
      } else if (op === 'missing') {
        op = 'constant_score'
        const missing = {}
        const filter = {}
        missing['field'] = field
        filter['missing'] = missing
        query['filter'] = filter
      } else {
        query[field] = value
      }
      clause[op] = query
      return clause
    }
  }
}
</script>
<style scoped>
.search-form-inline .el-form-item {
  margin: 0;
}
.adv-earch-form-inline .el-form-item {
  margin-top: 10px;
}

.search-form-inline {
  display: inline-block;
}

.adv-earch-form-inline {
  display: inline-block;
  margin-top: 6px;
}
.el-form--inline>* {
  margin-right:10px
}
.el-form-item{
  margin: 22px 20px 2px 0;
}
.el-form-item{
  margin-bottom:2px;
}
.leftFloat .el-row{
  float:left;
  width:250px;
}
.leftFloat .el-row input{
  width:250px;
}
.leftFloat .el-form-item{
  margin:0;
}
.leftFloat .button{
  float:left;
}
.el-form--inline .el-form-item {
  width:200px;
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.el-form-item.is-required .el-form-item__label:before{
  content:''
}
.el-form-item.is-required .el-form-item__label:after{
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.el-cascader{
  width:100%;
}
.el-select{
  width:100%;
}
.hidden{
  display:none;
}
h4{
  margin-top:40px;
  margin-bottom:10px;
}
.el-date-editor.el-input{
  width:100%;
}
.el-form--inline.el-form--label-top .el-form-item__content{
  width:90%
}
.leftFloat .el-form--inline .el-form-item{
  margin-right:10px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>
