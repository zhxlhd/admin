<template>
    <div>
        <multiselect v-model="selectedMaterials" id="ajax" label="code" track-by="code"  open-direction="bottom" :options="materials" :multiple="false" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="true" :options-limit="300" :limit="3" :limit-text="limitText" :max-height="600" :show-labels="false" @search-change="asyncFind">
            <template slot="clear" slot-scope="props">
            <div class="multiselect__clear" v-if="selectedMaterials.length" @mousedown.prevent.stop="clearAll(props.options.code)"></div>
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
      selectedMaterials: [],
      materials: [],
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
      this.selectedMaterials = []
    }
  }
}
</script>
<style src ="vue-multiselect/dist/vue-multiselect.min.css"> </style>