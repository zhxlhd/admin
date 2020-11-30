
import { API_GATEWAY } from '@/config/index.js'
import Vue from 'vue'
const DictStore = {
  state: {
    data: {}, // 数字字典映射
    dict: {}  // 数字字段
  },
  formatDict (type, key) {
    return this.state.data[type] && this.state.data[type][key] || key;
  },
  dicts (type, key){
    return this.state.dict[type] && this.state.dict[type].find(item => item.value === key)['label'] || key;
  },
  fetch (types) {
    const options = {
      params: { type: types }
    }
    Vue.http.get(API_GATEWAY + '/api/dic/fetch', options).then(response => {
      const dicts = Object.keys(response.data);

      dicts.forEach(function (type) {
        DictStore.state.data[type] = response.data[type]
      })

      dicts.forEach((type) => {
        DictStore.state.dict[type] = Object.keys(response.data[type]).map((el) => {
          return {id: el,value: el,label: response.data[type][el]};
        });
      });
    }, response => {
    })
  }
}

export default DictStore
