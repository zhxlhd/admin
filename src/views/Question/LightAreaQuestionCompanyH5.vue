<template>
  <div class="detailForm">
    <h2>重点疫区和境外来深（光明）人员登记</h2>
    <van-form>
       <van-field
          disabled
          v-model="companyName"
          label="所属企业"
        />
        <van-field
          v-model="areaType"
          label="来源地类型"
          readonly
          clickable
          required
          placeholder="请选择"
          @click="showType = true"
        />
         <van-field
          v-model="country"
          label="国籍"
          readonly
          clickable
          required
          placeholder="请选择"
          @click="showCountry = true"
        />
        <van-field
          v-model="userName"
          required
          label="姓名"
          placeholder="请输入姓名"
          @blur="getUserInfo"
        />
        <van-field
          v-model="idCard"
          required
          label="身份证"
          placeholder="请输入身份证"
          @blur="getUserBaseInfo"
          :error-message="idCardError"
          v-show="showIdCard"
        />
        <van-field
          v-model="returnShenZhenTime"
          label="返深日期"
          readonly
          required
          placeholder="请选择"
          @click="showPickerArrivalDate = true"
        />
         <van-field
          readonly
          clickable
          required
          label="返深前住址"
          placeholder="请选择返深前住址"
          :value="addressBefore"
          @click="showAddressBefore = true"
        />
        <!--entryMode-->
        <van-field
          v-model="vehicle" 
          required
          readonly
          label="交通工具"
          placeholder="请选择"
          v-show="showVehicle"
          @click="showPickerTraffic = true"
        />
        <van-field
          v-model="entryMode" 
          required
          readonly
          v-show="showEntryMode"
          label="入境方式"
          placeholder="请选择"
          @click="showPickerEntryMode = true"
        />
        <van-field
          v-model="wharfOrAirport"
          required
          :label="wharfOrAirportLabel"
          placeholder="请输入"
          v-show="showWharfOrAirport"
        />
        <van-field
          v-model="location"
          required
          readonly
          label="现居住地"
          placeholder="请选择"
          @click="showIsInShenZhen = true"
        />
         <van-field
          readonly
          clickable
          required
          label="区、县"
          placeholder="请选择区县"
          :value="addressInSZ"
          v-show="showIsInShenZhenDetail"
          @click="showAddressInSZ = true"
        />
        <van-field
          readonly
          clickable
          required
          label="街道、社区"
          placeholder="请选择街道、社区"
          :value="street"
          v-show="showAddressInSZDetail"
          @click="showStreet = true"
        />
         <!-- <van-field
          v-model="shenZhenDetailAddress"
          required
          label="详细住址"
          v-show="showAddressInSZDetail"
          placeholder="请输入在深详细地址"
        /> -->
    </van-form>
    <!-- 弹出层 -->
    <div>
      <van-popup v-model="showCountry" position="bottom">
        <van-picker
          show-toolbar
          :columns="countryColumns"
          @cancel="showCountry = false"
          @confirm="onConfirmCountry"
        />
      </van-popup>
      <!-- 交通工具 -->
      <van-popup v-model="showPickerTraffic" position="bottom">
        <van-picker
          show-toolbar
          :columns="trafficTools"
          @cancel="showPickerTraffic = false"
          @confirm="onConfirmTraffic"
        />
      </van-popup>
         <!-- 交通工具 -->
      <van-popup v-model="showPickerEntryMode" position="bottom">
        <van-picker
          show-toolbar
          :columns="trafficTools"
          @cancel="showPickerEntryMode = false"
          @confirm="onConfirmEntryMode"
        />
      </van-popup>
      <!-- 所属类型 -->
      <van-popup v-model="showType" position="bottom">
        <van-picker
          show-toolbar
          :columns="typeColumns"
          @cancel="showType = false"
          @confirm="onConfirmType"
        />
      </van-popup>
      <!-- 现居住地 -->
      <van-popup v-model="showIsInShenZhen" position="bottom">
        <van-picker
          show-toolbar
          :columns="isInShenZhenColumns"
          @cancel="showIsInShenZhen = false"
          @confirm="onConfirmIsInShenZhen"
        />
      </van-popup>
      <van-popup v-model="showAddressBefore" position="bottom">
        <van-area :area-list="areaList"  :columns-num="columnsNum" title="返深前居住地" @confirm="onConfirmAddressBefore"
             @cancel="showAddressBefore = false"/>
      </van-popup>
      <!--深圳市区-->
      <van-popup v-model="showAddressInSZ" position="bottom">
        <van-area :area-list="lightAreaList"  :columns-num="1" title="县、区" @confirm="onConfirmAddressInSZ"
             @cancel="showAddressInSZ = false" />
      </van-popup>
      <!--光明区-->
       <van-popup v-model="showStreet" position="bottom">
        <van-area :area-list="lightAreaCityList"  :columns-num="2" title="街道、社区" @confirm="onConfirmStreet"
             @cancel="showStreet = false" />
      </van-popup>
      <!--返深时间-->
      <van-popup v-model="showPickerArrivalDate" position="bottom">
        <van-datetime-picker
          @confirm="confirmArrivalDate()"
          @cancel="showPickerArrivalDate = false"
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
        />
      </van-popup>
    </div>


    <!-- 底部 -->
    <h3 style="padding: 16px">面对疫情不要慌，科学防治有保障</h3>
    <van-button @click="submit()" type="primary" block style="margin-top: 50px;margin-bottom: 30px">提交</van-button>
    <van-dialog v-model="showDialog"  >
      <van-image src="static/gx.jpg"/>
    </van-dialog>
  </div>
</template>


<script>
  import {Dialog, Toast} from 'vant';
  import axios from 'axios';
  import { API_GATEWAY } from '@/config/index.js';
  // import areaListObj from './constant/area.js'
  import otherCountry from './constant/otherCountry.js'
  import lightAreaListObj from './constant/lightArea.js'
  import lightAreaCityListObj from './constant/lightAreaCity.js'
  import { watch } from 'fs';
  import areaListObj from './constant/area.js';
  import otherCountryListObj from './constant/otherCountry.js';
  export default {
    name: 'LightAreaQuestionCommunityH5',
    data() {
      return {
        tenantId: '',        // 基本信息
        vehicleLabel:  '交通工具', 
        companyName: '',         // 所属企业
        userName: '',        // 姓名
        idCard: '',          // 身份证
        country: '',
        showCountry: false,
        showDialog: false,
        addressBefore: '',        // 返深前地址 拼接
        addressInSZ:'',  //在深地址  拼接
        vehicle: '', // 交通工具
        wharfOrAirport: '', // 码头/机场
        wharfOrAirportLabel: '航班',
        areaType: '', // 所属类型
        idCardError: '',
        idCardIsOk: false,
        columnsNum: 3,
        showWharfOrAirport: false,
        returnShenZhenTime: '', // 返深时间
        location: '', // 现居住地  深圳内 深圳外
        street: '', //街道社区
        shenZhenCounty: '', // 区
        shenZhenStreet: '',   // 街道
        shenZhenCommunity: '',  //社区
        shenZhenDetailAddress: '',  //详细地址
        beforeReturnProvince: '',   //返深前省
        beforeReturnCity: '',   // 返深前市
        beforeReturnCounty: '',  // 返深前县
        entryMode: '',// 入境方式
        countryColumns: ['中国','其他国籍'],
        trafficTools: [], // 交通方式
        typeColumns: [],
        isInShenZhenColumns: [],
        showPickerTraffic: false, // 显示交通工具选择
        showPickerEntryMode: false, // 显示入境方式选择
        showAddressBefore: false, // 显示返深前居住地
        showAddressInSZ: false, // 显示在深居住地
        showType: false,  // 显示所属类型
        showPickerArrivalDate: false, //显示返深时间
        showIsInShenZhen: false,  //显示现居住地
        showStreet: false, // 显示街道社区
        areaList: areaListObj,  // 全部地址
        areaListAll: [],
        otherCountryList: otherCountryListObj,
        lightAreaList: lightAreaListObj,  // 深圳区
        lightAreaCityList: [],  //光明区
        showVehicle: false,
        idCardIsOk: false,
        showEntryMode: false,
        showIsInShenZhenDetail: false, // 根据现居住地【深圳内、深圳外】判断 深圳内显示 深圳外不显示
        showAddressInSZDetail: false, // 根据区县【光明区、其他区】判断 光明区显示 其他区不显示
        showAirPort: false, // 根据类型【境内人员 境外人员】判断 境内人员不显示 境外人员显示
        showIdCard: false, // 根据类型【境内人员 境外人员】判断 境内人员不显示 境外人员显示
        tit: '重点疫区和境外来深（光明）人员登记系统......',
        currentDate: new Date(),       // 当前日期
        areaListUrl: "/question/map/getAllCitys", // area.js
        dictTypeUrl: "/question/epidemicRegisterPerson/getDictionaryByType?type="
      }
    },
    methods: {
        /** 获取来源地
       * @param void
       * @return void
       */
      getAreaList() {
        axios.get(
            `${API_GATEWAY}${this.areaListUrl}`
          ) .then(res => {
            // 省市县覆盖本地数据
            this.areaList = res.data;
            this.areaListAll = res.data;
          });
      },
      getDictType(value, options){
        var data = []
        axios.get(
            `${API_GATEWAY}${this.dictTypeUrl}${value}`
          ) .then(res => {
            // 省市县覆盖本地数据
            res.data.list.forEach(item=>{
              data.push(item.value)
            })
            this[options] = data
          });
      },
      timeFormatDay(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        return year + '-' + month + '-' + day;
      },
      // 交通工具
      onConfirmTraffic(value) {
        this.vehicle = value;
        this.showPickerTraffic = false;
      },
      onConfirmEntryMode(value) {
        this.entryMode = value;
        this.showPickerEntryMode = false;
      },
      // 所属类型
      onConfirmType(value) {
        this.areaType = value;
        this.showType = false;
      },
      onConfirmCountry(value){
        this.country = value;
        this.showCountry = false
      },
      // 来深时间
      confirmArrivalDate(index) {
        this.returnShenZhenTime = this.timeFormatDay(this.currentDate);
        this.showPickerArrivalDate = false
      },
      // 现居住地
      onConfirmIsInShenZhen(value) {
        this.location = value
        this.showIsInShenZhen = false
      },
      // 返深前住址
      onConfirmAddressBefore(value) {
        if(this.columnsNum === 3 ) {
          this.beforeReturnProvince = value[0].name
          this.beforeReturnCity = value[1].name
          this.beforeReturnCounty = value[2].name
          this.addressBefore = value[0].name + value[1].name + value[2].name
        } else {
          this.beforeReturnProvince = value[0].name
          this.addressBefore = value[0].name
          this.beforeReturnCity = ''
          this.beforeReturnCounty = ''
        }
        this.showAddressBefore = false
      },
       // 在深前住址
      onConfirmAddressInSZ(value) {
        this.shenZhenCounty = value[0].name
        this.shenZhenStreet = ''
        this.shenZhenCommunity = ''
        this.addressInSZ = value[0].name
        this.showAddressInSZ = false
      },
      // 光明区街道社区
      onConfirmStreet(value) {
        this.shenZhenStreet = value[0].name
        this.shenZhenCommunity = value[1].name
        this.street = value[0].name + value[1].name
        this.showStreet = false
      },
      // 头部标题滚动效果
      TitleScrolling() {
        setInterval(() => {
          // 截取首字符串(第一个)
          let head = this.tit.substring(0, 1);
          // 截取除首字符串外所有字符串(除第一个所有)
          let foot = this.tit.substring(1);
          // 头尾拼接后赋给data => tit属性
          this.tit = foot + head;
          // 最后赋给最终显示的标题(标题)
          document.title = this.tit;
        }, 400)
      },
      // 提交 基本信息 
      submitBaseData() {
        let params = {
          companyName: this.companyName,
          userName: this.userName,
          areaType: this.areaType,
          idCard: this.idCard,
          vehicle: this.vehicle,
          wharfOrAirport: this.wharfOrAirport,
          entryMode: this.entryMode,
          shenZhenCounty: this.shenZhenCounty,
          shenZhenStreet: this.shenZhenStreet,
          shenZhenCommunity: this.shenZhenCommunity,
          shenZhenDetailAddress: this.shenZhenDetailAddress,
          beforeReturnProvince: this.beforeReturnProvince,
          beforeReturnCity: this.beforeReturnCity,
          beforeReturnCounty: this.beforeReturnCounty,
          location: this.location,
          country: this.country,
          returnShenZhenTime: this.returnShenZhenTime,
          state: 0
        };
        axios.post(`${API_GATEWAY}/question/epidemicRegisterPerson/saveOne`, params, {
          headers: {
            'X-TenantId': this.tenantId
          }}).then(res => {
          // 在成功的回调里，从 response.data 获取返回数据
          if (res.data.code == 200) {
            Toast.success(res.data.message);
          } else {
            Toast.fail(res.data.message);
          }
        })
      },
      // 提交按钮
      submit() {
        // 基本信息
       if (!this.companyName || !this.userName || !this.returnShenZhenTime || !this.areaType ||!this.addressBefore  || !this.country) {
          Toast.fail('请将基本信息必填项填写完整');
          return;
        }
        // 身份证号
        if(this.showIdCard) {
          if(!this.idCardIsOk || !this.idCard ) {
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        // 境内 境外校验
        if(this.areaType === '境内') {
          if(!this.vehicle) {
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        } else{
          if(!this.entryMode) {
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        // 显示车次 则车次必填
        if(this.showWharfOrAirport){
          if(!this.wharfOrAirport){
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        // 深圳内 则区县必填 
        if(this.location === '深圳内' || this.location === '深圳市内'){
          // 选择区县
          if(!this.addressInSZ) {
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        // 光明区 则街道必填
        if(this.addressInSZ === '光明区'){
           if(!this.street ) {
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        this.submitBaseData();
      },
      // 获取基础信息
      getUserBaseInfo() {
        if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.idCard.trim())){
          this.idCardError = '请输入有效的身份证号'
          this.idCardIsOk = false
        } else {
          this.idCardError = ''
          this.idCardIsOk = true
        }
      },
      // 获取所属公司名称
      getCompanyName() {
        axios.get(`${API_GATEWAY}/question/community/getCompanyName`,{
          headers: {
            'X-TenantId': this.tenantId
          }}).then((res) => {
          if (res.status == 200 && !!res.data) {
            this.companyName = res.data.companyName;
            // this.getUserBaseInfo();
          } else {
          }
        })
      },
      getUserInfo(value){
        axios.post(`${API_GATEWAY}/question/epidemicRegisterPerson/selectOneByCondition`, {userName: this.userName}, {
          headers: {
            'X-TenantId': this.tenantId
          }}).then(res => {
          // 在成功的回调里，从 response.data 获取返回数据
          // if (res.status == 200 && !!res.data.data) {
          //     let data = res.data.data
          //     this.companyName = data.companyName;
          //     this.areaType = data.areaType,
          //     this.idCard = data.idCard,
          //     this.country = data.country,
          //     this.vehicle = data.vehicle,
          //     this.entryMode = data.entryMode,
          //     this.wharfOrAirport = data.wharfOrAirport,
          //     this.shenZhenCounty = data.shenZhenCounty,
          //     this.shenZhenStreet = data.shenZhenStreet,
          //     this.shenZhenCommunity = data.shenZhenCommunity,
          //     this.shenZhenDetailAddress =  data.shenZhenDetailAddress,
          //     this.beforeReturnProvince = data.beforeReturnProvince,
          //     this.beforeReturnCity =  data.beforeReturnCity,
          //     this.beforeReturnCounty = data.beforeReturnCounty,
          //     this.location = data.location,
          //     this.returnShenZhenTime = data.returnShenZhenTime
          //     this.addressBefore = data.beforeReturnProvince + data.beforeReturnCity + data.beforeReturnCounty
          //   } else {

          //   }
        })
      },
    },
    mounted() {
      this.TitleScrolling();
      this.tenantId = this.$route.query.tenantId || JSON.parse(window.localStorage.getItem('user')).tenantId;
      this.showDialog = true;
      this.lightAreaCityList = lightAreaCityListObj
      this.getCompanyName();
      this.getAreaList();
      this.getDictType('vehicle','trafficTools');
      this.getDictType('area_type','typeColumns');
      this.getDictType('entry_mode','areaTypeOptions');
      this.getDictType('location','isInShenZhenColumns');
      this.getDictType('country','countryColumns');
      // this.getDictType('person_identity','areaTypeOptions');
      // this.getDictType('person_type','areaTypeOptions');
    },
    // 创建前设置 设置body滚动
    beforeCreate () {
      document.querySelector('body').setAttribute('style', 'overflow: auto;');
    },
    // 销毁前清除
    beforeDestroy () {
      document.querySelector('body').removeAttribute('style');
    },
    watch: {
      // 深圳内 深圳外
      location: function (value) {
        this.shenZhenCounty = ''
        this.shenZhenStreet = ''
        this.shenZhenCommunity = ''
        this.shenZhenDetailAddress = ''
        this.street = ''
        this.addressInSZ = ''
        if(value === '深圳内'|| value === '深圳市内') {
          this.showIsInShenZhenDetail = true
        } else {
          this.showIsInShenZhenDetail = false
        }
      },
      // 区 县
      addressInSZ: function (value) {
        this.shenZhenCounty = ''
        this.shenZhenStreet = ''
        this.shenZhenCommunity = ''
        this.shenZhenDetailAddress = ''
        this.street = ''
        if(value === '光明区') {
          this.showAddressInSZDetail = true
        } else {
          this.showAddressInSZDetail = false
        }
      },
      areaType: function (value) {
        this.idCard = ''
        this.vehicle = ''
        this.entryMode = ''
        this.country = ''
        this.shenZhenCounty = ''
        this.shenZhenStreet = ''
        this.wharfOrAirport = ''
        this.shenZhenCommunity = ''
        this.shenZhenDetailAddress = ''
        this.beforeReturnProvince = ''
        this.beforeReturnCity = ''
        this.beforeReturnCounty = ''
        this.addressBefore = ''
        this.addressInSZ = ''
        this.location = ''
        this.idCardError = ''
        this.returnShenZhenTime = ''
        if(value === '境内') {
          this.showVehicle = true
          this.showEntryMode = false
          this.showAirPort = false
          this.areaList = this.areaListAll
          this.columnsNum = 3
        } else {
          this.showEntryMode = true
          this.showVehicle = false
          this.showAirPort = true
          this.areaList = otherCountryListObj
          this.columnsNum = 1
        }
      },
      country: function (value) {
        this.idCard = ''
        this.vehicle = ''
        this.entryMode = ''
        this.shenZhenCounty = ''
        this.shenZhenStreet = ''
        this.wharfOrAirport = ''
        this.shenZhenCommunity = ''
        this.shenZhenDetailAddress = ''
        this.beforeReturnProvince = ''
        this.beforeReturnCity = ''
        this.beforeReturnCounty = ''
        this.addressBefore = ''
        this.addressInSZ = ''
        this.location = ''
        this.idCardError = ''
        this.returnShenZhenTime = ''
        if(value === '中国') {
          this.showIdCard = true
          this.idCardError = ''
          this.idCardIsOk = false
        } else {
          this.showIdCard = false
          this.idCardError = ''
          this.idCardIsOk = true
        }
      },
      vehicle: function (value) {
        this.wharfOrAirport = ''
        if(value === '飞机') {
          this.wharfOrAirportLabel = '航班'
          this.showWharfOrAirport = true
        } else if (value === '火车/高铁') {
          this.wharfOrAirportLabel = '车次'
          this.showWharfOrAirport = true
        } else if (value === '火车') {
          this.wharfOrAirportLabel = '车次'
          this.showWharfOrAirport = true
        } else if(value === '高铁'){
          this.wharfOrAirportLabel = '车次'
          this.showWharfOrAirport = true
        }
        else {
          this.showWharfOrAirport = false
        }
      },
      entryMode: function (value) {
        this.wharfOrAirport = ''
       if(value === '飞机') {
          this.wharfOrAirportLabel = '航班'
          this.showWharfOrAirport = true
        } else if (value === '高铁') {
          this.wharfOrAirportLabel = '车次'
          this.showWharfOrAirport = true
        } 
        else if (value === '火车') {
          this.wharfOrAirportLabel = '车次'
          this.showWharfOrAirport = true
        } else {
          this.showWharfOrAirport = false
        }
      }
    }
  }
</script>
<style scoped>
.detailForm{
    text-align: center
  }
  .span-title {
    float: left;
    padding: 8px;
    text-align: left;
    background: #eee;
    width: 100%;
  }
  .coll {
    margin: 30px 0px;
  }

  .cell_text_center /deep/ .van-cell__title{
    text-align: center;
  }
</style>

