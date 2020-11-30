<template>
  <div>
    <el-form ref="form" label-width="80px" label-position="right">
    <el-form-item label="省份">
      <addrselect
          :initselectedvalue="initprovselectedvalue"
          :addrs="provAddrs"
          v-model="provSelected"
          @change="provChange"
          class="select-31"
          id="prov_select"
          name="prov" lazy>
      </addrselect>
    </el-form-item>
    <el-form-item label="市">
      <addrselect
          :initselectedvalue="initcityselectedvalue"
          :addrs="cityAddrs"
          v-model="citySelected"
          @change="cityChange"
          class="select-31"
          id="city_select"
          name="city" lazy>
      </addrselect>
    </el-form-item>
    <el-form-item label="区县">
      <addrselect
          :initselectedvalue="initregionselectedvalue"
          :addrs="regionAddrs"
          v-model="regionSelected"
          class="select-31"
          id="region_select"
          name="region" lazy>
        </addrselect>
    </el-form-item>
    <el-form-item label="详细地址" v-if="detail">
      <el-input id="addr" name="addr" class="text" v-model="addrsInDetail" placeholder="请填写具体地址"></el-input>
    </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Addrselect from './Addrselect'
import addrArr from './addr-arr'

// 根据id获取市/区数据函数，动态，经常改变
function getAddrsArrayById (id) {
  return addrArr[id].map(item => {
    return {
      'text': item[1],
      'value': item[0]
    }
  })
}

export default {
  name: 'Address',
  components: {
    Addrselect
  },
  props: {
    initprovselectedvalue: String,
    initcityselectedvalue: String,
    initregionselectedvalue: String,
    initaddrsindetail: String,
    detail: Boolean
  },

  data () {
    return {
      provAddrs: getAddrsArrayById(0),
      cityAddrs: (this.initprovselectedvalue !== '0' && this.initprovselectedvalue !== 0) ? getAddrsArrayById(this.initprovselectedvalue) : [],
      regionAddrs: (this.initcityselectedvalue !== '0' && this.initcityselectedvalue !== 0) ? getAddrsArrayById(this.initcityselectedvalue) : [],
      provSelected: this.initprovselectedvalue,
      citySelected: this.initcityselectedvalue,
      regionSelected: this.initregionselectedvalue,
      addrsInDetail: this.initaddrsindetail
    }
  },

  watch: {
    provSelected: function (val, oldVal) {
      if (val !== oldVal) {
        if (val !== '0' && val !== 0) {
          this.cityAddrs = getAddrsArrayById(val)
        } else {
          this.cityAddrs = []
        }
        this.citySelected = '0'
      }
    },
    citySelected: function (val, oldVal) {
      if (val !== oldVal) {
        if (val !== '0' && val !== 0) {
          this.regionAddrs = getAddrsArrayById(val)
        } else {
          this.regionAddrs = []
        }
        this.regionSelected = '0'
      }
    }
  },
  methods: {
    provChange (val) {
      const oldVal = this.provSelected
      if (val !== oldVal) {
        if (val !== '0' && val !== 0) {
          this.cityAddrs = getAddrsArrayById(val)
        } else {
          this.cityAddrs = []
        }
        this.citySelected = '0'
      }
    },
    cityChange (val) {
      const oldVal = this.provSelected
      if (val !== oldVal) {
        if (val !== '0' && val !== 0) {
          this.regionAddrs = getAddrsArrayById(val)
        } else {
          this.regionAddrs = []
        }
        this.regionSelected = '0'
      }
    }
  }
}
</script>

<style scoped>
html {
  font-size: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  vertical-align: baseline;
  background: transparent;
  -webkit-touch-callout: none;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  list-style: none;
}
.select-31{
  width: 100%;
  margin-bottom: 22px;
}
.el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>
