<template>
  <multiselect 
    v-model="value.nameZH" 
    :disabled="disabledFlag" 
    placeholder="请选择国家" 
    label="nameZH" 
    track-by="code" 
    :options="options" 
    @input="change" 
    :option-height="104" 
    :show-labels="false" 
    ref="multiselect" 
    :customerAdd="customerAdd">
    <template slot="option" slot-scope="props">
      <div class="option__desc">
        <span class="option__title">{{ props.option.nameZH }}</span>
        <span class="option__small">{{ props.option.nameEN }}</span>
      </div>
    </template>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import countries from '../constant/countries.json'
export default {
  name: 'CountrySelect',
  components: {
    Multiselect
  },
  props: {
    customerAdd: Object,
    disabledFlag: Boolean
  },
  data () {
    return {
      value: {},
      options: countries
    }
  },
  created () {
    if (this.customerAdd) {
      this.value.nameZH = this.customerAdd
    }
  },
  watch: {
    customerAdd: function (val, old) {
      this.value.nameZH = val
    }
  },
  methods: {
    customLabel ({ nameEN, nameZH }) {
      return `${nameEN} – ${nameZH}`
    },
    change (value, id) {
      this.$emit('input', value.nameZH)
    }
  }
}
</script>

<style scope>
  /* .receiveBillList .multiselect{
    margin-top:36px;
  } */
  .multiselect__input, .multiselect__single{
    font-size: 14px!important;
    line-height: 26px;
    margin-bottom: 0px;
  }
  .multiselect__content-wrapper{
    font-size: 14px!important
  }
  .multiselect__tags {
    min-height: 28px;
    max-height: 28px;
  }
  .multiselect__select {
      height: 28px;
  }
  .multiselect__placeholder {
    margin: 0;
    padding: 0;
    padding-left: 10px;
  }
  /* .multiselect{
    width: 80%
  } */
</style>
