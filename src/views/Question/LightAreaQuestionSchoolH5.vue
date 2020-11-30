<template>
  <div class="detailForm">
    <h2>重点疫区和境外来深（光明）人员登记</h2>
    <van-form>
       <van-field
          disabled
          v-model="companyName"
          label="学校名称"
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
          v-model="personIdentity"
          label="身份"
          readonly
          clickable
          required
          placeholder="请选择"
          @click="showIdentity = true"
        />
         <van-field
          v-model="country"
          label="国籍"
          readonly
          clickable
          required
          v-show="showCountryPerson"
          placeholder="请选择"
          @click="showCountry = true"
        />
        <van-field
          v-model="userName"
          required
          label="姓名"
          @blur="getUserInfo"
          placeholder="请输入姓名"
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
          v-show="showVehicle"
          label="交通工具"
          placeholder="请选择"
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
     <van-collapse v-model="infoCollapse" accordion class="coll cell_text_center" v-show="showGuardians">
        <van-collapse-item title="监护人信息" name="info">
        <div v-for='(guardian,index) in guardians' :key="index">
          <van-field
              v-model="guardian.userName"
              required
              label="监护人姓名"
              placeholder="请输入监护人姓名"
            />
            <van-field
              v-model="guardian.country"
              label="国籍"
              readonly
              clickable
              required
              placeholder="请选择"
              @blur="changeGuardiansCountry(guardian)"
              @click="showGuardianCountry = true"
            />
            <van-popup v-model="showGuardianCountry" position="bottom">
              <van-picker
                show-toolbar
                v-model="guardianCountry"
                ref="guardianCountry"
                :columns="countryColumns"
                @cancel="showGuardianCountry = false"
                @confirm="onConfirmGuardianCountry(index)"
              />
            </van-popup>
            <van-field
              v-model="guardian.idCard"
              required
              label="有效身份证号"
              v-show="guardian.showGuardiansIdcard"
              placeholder="请输入有效身份证号"
              @blur="getIdCard(guardian)"
              :error-message="guardian.idCardError"
            />
            <van-field
              v-model="guardian.relationship"
              required
              label="关系"
              placeholder="请输入关系"
            />
            <div style="height: 10px; background-color: lightgray;"></div>
        </div>
        <button type="warning" @click="addChildren" >添加监护人</button>
        <button type="danger" @click="delChildren" >删除监护人</button>
        </van-collapse-item>
     </van-collapse>
    <!-- 弹出层 -->
    <div>
      <!-- 交通工具 -->
      <van-popup v-model="showPickerTraffic" position="bottom">
        <van-picker
          show-toolbar
          :columns="trafficTools"
          @cancel="showPickerTraffic = false"
          @confirm="onConfirmTraffic"
        />
      </van-popup>
       <van-popup v-model="showCountry" position="bottom">
        <van-picker
          show-toolbar
          :columns="countryColumns"
          @cancel="showCountry = false"
          @confirm="onConfirmCountry"
        />
      </van-popup>
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
      <!-- 身份 -->
      <van-popup v-model="showIdentity" position="bottom">
        <van-picker
          show-toolbar
          :columns="identityColunms"
          @cancel="showIdentity = false"
          @confirm="onConfirmIdentity"
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
     <van-dialog v-model="showDialog"  >
      <van-image src="static/gx.jpg"/>
    </van-dialog>
    <h3 style="padding: 16px">面对疫情不要慌，科学防治有保障</h3>
    <van-button @click="submit()" type="primary" block style="margin-top: 50px;margin-bottom: 30px;">提交</van-button>

  </div>
</template>


<script>
  import Vue from 'vue'
  import {Dialog, Toast} from 'vant';
  import axios from 'axios';
  import { API_GATEWAY } from '@/config/index.js';
  import areaListObj from './constant/area.js'
  import lightAreaListObj from './constant/lightArea.js'
  import lightAreaCityListObj from './constant/lightAreaCity.js'
  import otherCountryListObj from './constant/otherCountry.js';
  import { watch } from 'fs';
  export default {
    name: 'LightAreaQuestionCommunityH5',
    data() {
      return {
        tenantId: '',        // 基本信息
        vehicleLabel:  '交通工具', 
        companyName: '',         // 所属企业
        userName: '',        // 姓名
        idCard: '',          // 身份证
        idCardError: '',
        addressBefore: '',        // 返深前地址 拼接
        addressInSZ:'',  //在深地址  拼接
        vehicle: '', // 交通工具
        entryMode: '',
        columnsNum: 3,
        country: '',
        guardianCountry: '',
        showCountry: false,
        showDialog: false,
        idCardIsOk: false,
        countryColumns: ['中国','其他国籍'],
        areaType: '',
        wharfOrAirport: '', // 码头/机场
        type: '', // 所属类型
        returnShenZhenTime: '', // 返深时间
        guardians: [], // 身份
        showCountryPerson: false,
        showGuardianCountry: false,
        location: '', // 现居住地  深圳内 深圳外
        street: '', //街道社区
        guardianIndex: null,
        shenZhenCounty: '', // 区
        shenZhenStreet: '',   // 街道
        shenZhenCommunity: '',  //社区
        shenZhenDetailAddress: '',  //详细地址
        beforeReturnProvince: '',   //返深前省
        beforeReturnCity: '',   // 返深前市
        beforeReturnCounty: '',  // 返深前县
        personIdentity: '', // 身份信息
        showGuardiansIdcard: false,
        guardianIdCardError: '',
        areaListAll: [],
        trafficTools: [], // 交通方式
        typeColumns: [],
        identityColunms: [],
        isInShenZhenColumns: ['深圳内','深圳外'],
        showIdentity: false, // 显示身份
        showPickerTraffic: false, // 显示交通工具选择
        showPickerEntryMode: false,
        showAddressBefore: false, // 显示返深前居住地
        showAddressInSZ: false, // 显示在深居住地
        showType: false,  // 显示所属类型
        showEntryMode: false,
        showVehicle: false,
        showWharfOrAirport: false,
        wharfOrAirportLabel: '航班',
        showPickerArrivalDate: false, //显示返深时间
        showIsInShenZhen: false,  //显示现居住地
        showStreet: false, // 显示街道社区
        areaList: areaListObj,  // 全部地址
        otherCountryList: otherCountryListObj,
        lightAreaList: lightAreaListObj,  // 深圳区
        lightAreaCityList: lightAreaCityListObj,  //光明区
        showIsInShenZhenDetail: false, // 根据现居住地【深圳内、深圳外】判断 深圳内显示 深圳外不显示
        showAddressInSZDetail: false, // 根据区县【光明区、其他区】判断 光明区显示 其他区不显示
        showAirPort: false, // 根据类型【境内人员 境外人员】判断 境内人员不显示 境外人员显示
        showIdCard: false, // 根据身份 【学生，教师】判断 学生不显示身份证 教师显示身份证
        infoCollapse: ['info'], // 手风琴默认展开 item 对应的 name 属性
        showGuardians: false, // 根据身份 【学生，教师】判断 学生显示 教师不显示监护人
        tit: '重点疫区和境外来深（光明）人员登记系统......',
        currentDate: new Date(),       // 当前日期
        guardianIdCard: false,
        guardians: [{userName: '', idCard: '', relationship: '',idCardError: '', country: ''}],
        areaListUrl: "/question/map/getAllCitys", // area.js
        dictTypeUrl: "/question/epidemicRegisterPerson/getDictionaryByType?type="
      }
    },
    methods: {
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
          //     this.guardians = data.epidemicRegisterStudentGuardianList
          //   } else {

          //   }
        })
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
      onConfirmEntryMode(value){
        this.entryMode = value;
        this.showPickerEntryMode = false;
      },
      // 所属类型
      onConfirmType(value) {
        this.areaType = value;
        this.showType = false;
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
      onConfirmIdentity(value) {
        this.personIdentity = value
        this.showIdentity = false
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
      onConfirmGuardianCountry(index){
        let value = this.$refs.guardianCountry[index].getValues()[0]
        Vue.set(this.guardians[index], 'country', value)
        this.showGuardianCountry = false
        if(value === '中国') {
          Vue.set(this.guardians[index], 'showGuardiansIdcard', true)
          Vue.set(this.guardians[index], 'idCardError', '')
        } else {
          Vue.set(this.guardians[index], 'showGuardiansIdcard', false)
          Vue.set(this.guardians[index], 'idCardError', '')
        }
      },
      onConfirmCountry(value){
        this.country = value;
        this.showCountry = false
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
          country: this.country,
          entryMode: this.entryMode,
          wharfOrAirport: this.wharfOrAirport,
          shenZhenCounty: this.shenZhenCounty,
          shenZhenStreet: this.shenZhenStreet,
          shenZhenCommunity: this.shenZhenCommunity,
          shenZhenDetailAddress: this.shenZhenDetailAddress,
          beforeReturnProvince: this.beforeReturnProvince,
          beforeReturnCity: this.beforeReturnCity,
          beforeReturnCounty: this.beforeReturnCounty,
          location: this.location,
          returnShenZhenTime: this.returnShenZhenTime,
          epidemicRegisterStudentGuardianList: this.guardians,
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
        let commitOk = true
        // 基础信息
        if (!this.companyName || !this.personIdentity || !this.userName || !this.returnShenZhenTime || !this.areaType ||!this.addressBefore ) {
          Toast.fail('请将基本信息必填项填写完整');
          return;
        }
        // 境内 境外 
        if(this.areaType === '境内') {
          if(!this.vehicle){
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        } else {
          if(!this.entryMode) {
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        if(this.personIdentity === '学生'){
          if(!this.guardianIdCard){
            Toast.fail('请将监护人信息必填项填写完整');
            return;
          }
          this.guardians.forEach(item=>{
            if(!item.userName || !item.idCard || !item.relationship){
              commitOk = false
            }
          })
          if(!commitOk){
            Toast.fail('请将监护人信息必填项填写完整');
            return;
          }
        }
        if(this.personIdentity === '教师'){
          if(!this.country){
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        if(this.personIdentity === '教师' && this.country === '中国'){
          if(!this.idCardIsOk || !this.idCard){
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        if(this.showWharfOrAirport){
          if(!this.wharfOrAirport){
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        if(this.location === '深圳内' || this.location === '深圳市内'){
          // 选择区县
          if(!this.addressInSZ) {
            Toast.fail('请将基本信息必填项填写完整');
            return;
          }
        }
        if(this.addressInSZ === '光明区'){
           if(!this.street) {
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
      getIdCard(guardian) {
        if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(guardian.idCard.trim())){
          Vue.set(guardian, 'idCardError', '请输入有效的身份证号')
          this.guardianIdCard = false
        } else {
          Vue.set(guardian, 'idCardError', '')
          this.guardianIdCard = true
        }
      },
      // 获取所属公司名称
      getschoolName() {
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
      addChildren() {
        var guardian = {
          userName: '', idCard: '', relationship: '',
        };
        this.guardians.push(guardian);
      },
      delChildren() {
        if (this.guardians.length > 1) this.guardians.pop();
      },
      changeGuardiansCountry(val){
        if(val.country === '中国') {
          Vue.set(this, 'showGuardiansIdcard', true)
          Vue.set(this, 'idCardError', '')
        } else {
          Vue.set(this, 'showGuardiansIdcard', false)
          Vue.set(this, 'idCardError', '')
        }
      }
    },
    mounted() {
      this.TitleScrolling();
      this.tenantId = this.$route.query.tenantId || JSON.parse(window.localStorage.getItem('user')).tenantId;
      this.showDialog = true;
      this.getschoolName();
      this.getAreaList();
      this.getDictType('vehicle','trafficTools');
      this.getDictType('area_type','typeColumns');
      this.getDictType('entry_mode','areaTypeOptions');
      this.getDictType('location','isInShenZhenColumns');
      this.getDictType('person_identity','identityColunms');
      this.getDictType('country','countryColumns');
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
        this.personIdentity = ''
        this.country = ''
        this.wharfOrAirport = ''
        this.shenZhenCounty = ''
        this.shenZhenStreet = ''
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
      personIdentity: function (value){
        this.guardians = []
        this.idCard = ''
        this.vehicle = ''
        this.country = ''
        this.entryMode = ''
        this.wharfOrAirport = ''
        this.shenZhenCounty = ''
        this.shenZhenStreet = ''
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
        if(value === '学生'){
          this.showIdCard = false
          this.showGuardians = true
          this.showCountryPerson = false
        } else {
          this.showIdCard = true
          this.showGuardians = false
          this.showCountryPerson = true
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
        } else if (value === '火车') {
          this.wharfOrAirportLabel = '车次'
          this.showWharfOrAirport = true
        } 
        else {
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

