<template>
<div>
  <multiselect v-model="value.code" id="ajax" label="code" track-by="code" placeholder="请选择" open-direction="bottom" :options="materials"  :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="true" :options-limit="300" :limit="1"  :max-height="600" :show-no-results="false"  :show-labels="false" @search-change="asyncFind">
    <template slot="option" slot-scope="props">
        <div class="option__desc"><span class="option__title">{{ props.option.code}}</span></div>
    </template>
  </multiselect>
</div>
</template>
<script>
import Multiselect from 'vue-multiselect'
export default {
  components: {
    Multiselect
  },
  data () {
    return {
      selectedCountries: [],
      materials: [],
      value: {},
      selectedMaterial: [],
      isLoading: false
    }
  },
  methods: {
    limitText (count) {
      return `and ${count} other materials`
    },
    asyncFind (query) {
      this.isLoading = true
      var vm = this
      this.$root.ajaxData('/materials/select/options/code?pageSize=10&query=' + query, {}, function (data) {
        vm.materials = data
        vm.isLoading = false
      }, 'GET')
    },
    clearAll () {
      this.selectedCountries = []
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
