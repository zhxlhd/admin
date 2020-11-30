<!-- created by zhongxiaolong on 2020/02/29 -->
<!-- 疫情地图 EpidemicSituationMap -->
<template>
  <div style="background: #F6F7F8; height: 100%">
    <div class="form" style="margin-bottom: 10px;">
      <van-field
        :value="sourceArea"
        required
        readonly
        center
        label="来源地:"
        placeholder="选择（省、市、县）"
        @focus="showAreaPopup = true"
      >
        <van-button slot="button" size="small" type="info" @click="query()"
          >查询</van-button
        >
      </van-field>
      <van-field v-show="false" readonly v-model="riskLevel" label="风险等级:" :class="{ 'risk-level-red':riskLevel == '高风险','risk-level-orange':riskLevel == '中风险','risk-level-green':riskLevel == '低风险' }"/>
      <van-field readonly v-model="riskRemind" label="疫情提示:"/>
      <van-field disabled v-model="guidelines" rows="2" autosize type="textarea"/>
    </div>
   <!-- <div id="stituationMap" :style="{ width: '100%', height: '400px' }"></div> -->
    <img src="./constant/china-map.jpg" alt="" :style="{ width: '100%', height: 'auto' }">
    <!-- 省市区 -->
    <van-popup v-model="showAreaPopup" position="bottom">
      <van-area
        @confirm="confirmArea"
        @cancel="showAreaPopup = false"
        :area-list="areaList"
        :columns-num="3"
        title="来源地"
      />
    </van-popup>
  </div>
</template>
<script>
import { API_GATEWAY } from "@/config/index.js";
import axios from 'axios';
// import "@/constant/map/js/china.js";
import Area from './constant/custom-area.js';

export default {
  data() {
    return {
      sourceArea: "", // 来源地
      sourceAreaList: [], // 来源地省市区
      riskLevel: "", // 风险等级
      riskRemind: "",// 疫情提示
      guidelines: "", // 复工指引
      epidemicSituationData: [],
      title: '光明区重点用工地区疫情风险示意图......',
      epidemicSituationDataApi: "/question/map/getAllEpidemicData", // 获取所有疫情数据
      queryEpidemicSituationApi: "/question/map/getEpidemicDataByCounty", // 查询地区疫情数据
      // getCountyInfosApi: "/question/map/getCountyInfoByCity?city=", // 通过市级查询县级信息接口 功能取消
      showAreaPopup: false, // 显示省市区Popup
      areaList: Area, // area.js
      // areaList: [],
      areaListUrl: "/question/map/getAllCitys", // area.js
    };
  },
  created() {
    this.getAreaList();
  },
  mounted() {
    // title 滚动
    this.TitleScrolling();
    // 获取疫情数据
    // this.getEpidemicSituationData();
    // 渲染 canvas 地图
    // this.drawMap();
  },
  methods: {
    /** 获取来源地
     * @param void
     * @return void
     */
    getAreaList() {
      axios
        .get(
          `${API_GATEWAY}${this.areaListUrl}`
        )
        .then(res => {
          // 省市县覆盖本地数据
          this.areaList = res.data;
        });
    },
    /** 来源地查询
     * @param void
     * @return void
     */
    query() {
      let [province='',city='',county=''] = this.sourceAreaList;
      axios
        .get(
          `${API_GATEWAY}${this.queryEpidemicSituationApi}?province=${province}&city=${city}&county=${county}`
        )
        .then(res => {
          if(res.status && res.data){
            this.riskLevel = res.data.riskLevel;
            this.riskRemind = res.data.riskRemind;
            this.guidelines = res.data.returnWorkGuideline;
          }else{
            this.guidelines = '';
          }
        });
    },
    /** 画地图
     * @param void
     * @return void
     */
    drawMap() {
      let stituationMap = echarts.init(
        document.getElementById("stituationMap")
      );
      const _this = this;
      const option = {
        tooltip: {
          trigger: "item",
          padding: 0,
          formatter(param,ticket,callback) {
            let data = param.data;
            let name = data && data.name || '';
            let riskLevel = data && data.riskLevel || '';
            _this.guidelines = '';
              return `<div>
                <div style="float: left;padding:0 5px;">省份：${name}<br/>风险等级：${riskLevel}</div>
              </div>`
                // <div style="float: left;margin-top: 10px;border-left: 1px solid #fff;padding:0 5px;">详情&gt;</div>

          }
        },
        visualMap: {
          type: "piecewise",
          splitNumber: 3,
          left: "50px",
          bottom: "0",
          orient: "horizontal",
          pieces: [
            { value: 3, label: "高风险", color: "#D2352F" },
            { value: 2, label: "中风险", color: "#FCEF50" },
            { value: 1, label: "低风险", color: "#0f0" }
          ],
          itemGap: 10,
          itemSymbol: "rect",
          textStyle: {
            fontSize: 8
          }
        },
        series: [
          {
            name: "测试1",
            type: "map",
            mapType: "china",
            roam: false,
            zoom: 1.2,
            label: {
              normal: {
                show: true,
                fontSize: 8
              },
              emphasis: {
                show: true
              }
            },
            data: this.epidemicSituationData,
            itemStyle: {
              areaColor: "#FFF"
            }
          }
        ]
      };
      stituationMap.setOption(option);

      //
      stituationMap.off('click');
      stituationMap.on("click", res=> {
        this.sourceArea = '';
        this.riskLevel = '';
        if(res.data){
          this.sourceArea = res.data.name;
          this.riskLevel = res.data.riskLevel;
          this.guidelines = '';
        }
      });
    },
    /** 获取疫情数据
     * @param void
     * @return void
     */
    getEpidemicSituationData() {
      axios
        .get(`${API_GATEWAY}${this.epidemicSituationDataApi}`)
        .then(res => {
          if (res.status === 200 && res.data.length) {
            res.data.forEach(item => {
              let province = {
                name: item.province,
                value: this.formatterRiskLevel(item.riskLevel),
                riskLevel: item.riskLevel
              };
              this.epidemicSituationData.push(province);
            });
          }
        })
        .then(res => {
          // this.drawMap();
        });
    },
    /** 风险等级格式化
     * @param {String} val 风险等级 （高风险、中风险、低风险）
     * @return {Number} risklevel 风险等级 （3、2、1）
     */
    formatterRiskLevel(val) {
      let riskLevel;
      switch (val) {
        case "高风险":
          riskLevel = 3;
          break;
        case "中风险":
          riskLevel = 2;
          break;
        case "低风险":
          riskLevel = 1;
          break;
        default:
          break;
      }
      return riskLevel;
    },
    // 头部标题滚动效果
    TitleScrolling() {
      setInterval(() => {
        // 截取首字符串(第一个)
        let head = this.title.substring(0, 1);
        // 截取除首字符串外所有字符串(除第一个所有)
        let foot = this.title.substring(1);
        // 头尾拼接后赋给data => tit属性
        this.title = foot + head;
        // 最后赋给最终显示的标题(标题)
        document.title = this.title;
      }, 400)
    },
    /** 确认提交省市区
     * @param {Array} data 选中的省市县
     * @return void
     */
    confirmArea(data) {
      this.sourceArea = "";
      this.riskLevel = "";
      this.riskRemind = "";
      this.guidelines = "";
      this.sourceAreaList = [];
      let list = data.filter(res=> res !== undefined);
      list.map(item => {
        this.sourceAreaList.push(item.name);
      });
      this.sourceArea = [...new Set(this.sourceAreaList)].join('');
      this.showAreaPopup = false;
    },
  }
};
</script>
<style scope lang="scss">
  .item-cell { color: #323233;font-size: 14px;line-height: 24px;background-color: #fff;width: 100%;padding: 10px 16px 0 16px; }
  .item-value .van-cell__value { background: #f1f3f8;font-size: 15px }
  .risk-level-red .van-field__control { color:red;font-size: 15px }
  .risk-level-green .van-field__control { color:green;font-size: 15px }
  .risk-level-orange .van-field__control { color:orange;font-size: 15px }
  .van-field__body {
    textarea{
      font-size: 18px;
    }
  }
</style>
