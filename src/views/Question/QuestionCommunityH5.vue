<template>
  <div>
    <van-collapse v-model="infoCollapse" accordion class="coll cell_text_center">
      <van-collapse-item title="基本信息" name="info">
       <van-field
          disabled
          v-model="companyName"
          label="所属企业"
        />
        <van-field
          v-model="street"
          required
          label="街道"
          placeholder="请输入街道"
        />
        <van-field
          v-model="community"
          required
          label="社区"
          placeholder="请输入社区"
        />
        <van-field
          v-model="username"
          required
          label="姓名"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="idCard"
          required
          label="身份证"
          placeholder="请输入身份证"
          @blur="getUserBaseInfo"
        />
        <van-field
          v-model="domicile"
          label="户籍地"
          placeholder="请输入"
        />
        <van-field
          readonly
          clickable
          label="性别"
          :value="gender"
          placeholder="请选择"
          @click="showPickerGender = true"
        />
        <van-field
          v-model="age"
          type="number"
          label="年龄"
          placeholder="请输入"
        />
        <van-field
          v-model="telephone"
          type="number"
          label="联系电话"
          placeholder="请输入"
        />

      </van-collapse-item>
      
      <van-collapse-item title="流动情况" name="flow">
        
        <van-field
          v-model="residence"
          label="湖北（武汉）居住地"
          placeholder="请填写（市、区+详细住址/酒店名称详细地址）"
        />

        <van-field
          v-model="arrivalDate"
          label="来深日期"
          readonly
          placeholder="请选择"
          @click="showPickerArrivalDate = true"
        />
        
        <van-field
          v-model="leaveDate"
          label="离深日期"
          readonly
          placeholder="请选择"
          @click="showPickerLeaveDate = true"
        />

        <van-field
          v-model="vehicle"
          label="交通工具（车次/航班/汽车/自驾）"
          placeholder="请填写"
        />

        <van-field
          readonly
          clickable
          label="沿途是否停留"
          :value="isRest"
          placeholder="请选择"
          @click="showPickerIsRest = true"
        />

        <van-field
          v-show="isRest=='是'"
          v-model="restTime"
          label="停留时间"
          placeholder="请选择"
          @click="showPickerRestTime = true"
        />

        <van-field
          v-show="isRest=='是'"
          v-model="restLocation"
          label="停留地点"
          placeholder="请填写"
        />

        <van-field
          v-model="followerName"
          label="同行人姓名"
          placeholder="请填写同行人姓名"
        />

        <van-field
          v-model="destinationAddress"
          label="来深者填现居住地址或离深的填目的地（市、区）"
          placeholder="请填写"
        />

      </van-collapse-item>

      <van-collapse-item title="联络员信息" name="contact">
        <van-field
          v-model="liaison"
          label="联络员"
          placeholder="请填写"
        />

        <van-field
          v-model="liaisonPhone"
          type="number"
          label="联络员联系电话"
          placeholder="请填写"
        />

        <van-field
          readonly
          clickable
          label="是否配合"
          :value="isCoop"
          placeholder="请选择"
          @click="showPickerIsCoop = true"
        />

        <van-field
          readonly
          clickable
          label="体温监测（是否正常）"
          :value="temperatureInfo"
          placeholder="请选择"
          @click="showPickerTemperatureInfo = true"
        />

        <van-field
          readonly
          clickable
          label="健康情况"
          :value="healthyInfo"
          placeholder="请选择"
          @click="showPickerHealthyInfo = true"
        />
        
        <van-field
          v-model="isolatedLocation"
          label="隔离（留观）地点"
          placeholder="请输入"
        />

        <van-field
          v-model="remark"
          rows="4"
          autosize
          label="备注"
          type="textarea"
          placeholder="请输入"
        />
     </van-collapse-item>
    </van-collapse>

    <!-- 弹出层 -->
    <div>
      <!-- 性别 -->
      <van-popup v-model="showPickerGender" position="bottom">
        <van-picker
          show-toolbar
          :columns="genders"
          @cancel="showPickerGender = false"
          @confirm="onConfirmGender"
        />
      </van-popup>
      <!-- 来深时间 -->
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
      <!-- 离深时间 -->
      <van-popup v-model="showPickerLeaveDate" position="bottom">
        <van-datetime-picker
          @confirm="confirmLeaveDate()"
          @cancel="showPickerLeaveDate = false"
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
        />
      </van-popup>
      <!-- 是否配合 -->
      <van-popup v-model="showPickerIsCoop" position="bottom">
        <van-picker
          show-toolbar
          :columns="isCoops"
          @cancel="showPickerIsCoop = false"
          @confirm="onConfirmIsCoop"
        />
      </van-popup>
      <!-- 是否停留 -->
      <van-popup v-model="showPickerIsRest" position="bottom">
        <van-picker
          show-toolbar
          :columns="isRests"
          @cancel="showPickerIsRest = false"
          @confirm="onConfirmIsRest"
        />
      </van-popup>
      <!-- 停留时间 -->
      <van-popup v-model="showPickerRestTime" position="bottom">
        <van-datetime-picker
          @confirm="confirmResetTime()"
          @cancel="showPickerRestTime=false"
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
        />
      </van-popup>
      <!-- 体温检测 -->
      <van-popup v-model="showPickerTemperatureInfo" position="bottom">
        <van-picker
          show-toolbar
          :columns="temperatureInfos"
          @cancel="showPickerTemperatureInfo = false"
          @confirm="onConfirmTemperatureInfo"
        />
      </van-popup>
      <!-- 健康情况 -->
      <van-popup v-model="showPickerHealthyInfo" position="bottom">
        <van-picker
          show-toolbar
          :columns="healthyInfos"
          @cancel="showPickerHealthyInfo = false"
          @confirm="onConfirmHealthyInfo"
        />
      </van-popup>

    </div>


    <!-- 底部 -->
    <h3 style="padding: 16px">面对疫情不要慌、做好自我防护、配合公司做好防疫工作、按要求返工。</h3>
    <van-image src="static/gx.jpg"/>
    <van-button @click="submit()" type="primary" block style="margin-top: 50px;margin-bottom: 30px">提交</van-button>

  </div>
</template>


<script>
  import {Dialog, Toast} from 'vant';
  import axios from 'axios';
  import { API_GATEWAY } from '@/config/index.js';

  export default {
    name: 'QuestionCommunityH5',
    data() {
      return {
        tenantId: '',
        // 基本信息
        companyName: '',         // 所属企业
        street: '',          // 接到
        community: '',       // 社区
        username: '',        // 姓名
        idCard: '',          // 身份证
        domicile: '',        // 户籍地
        gender: '',          // 性别
        genders: ['男','女'], // 性别
        showPickerGender: false, // 显示性别选择
        age: '',             // 年龄
        telephone: '',       // 联系电话

        // 流动情况
        residence: '', // 湖北（武汉）居住地
        arrivalDate: '', // 来深日期
        showPickerArrivalDate: false, // 显示来深日期选择
        leaveDate: '', // 离深日期
        showPickerLeaveDate: false, // 显示离深日期选择
        vehicle: '', // 交通工具
        isRest: '', // 是否停留
        showPickerIsRest: false, // 显示是否停留选择
        isRests: ['是', '否'],
        restTime: '', // 停留时间
        showPickerRestTime: false, // 显示停留时间选择
        restLocation: '', // 停留地点
        followerName: '', // 同行人员姓名
        destinationAddress: '', // 来深者填现居住地址或离深的填目的地（市、区）

        // 联络员信息
        liaison: '', // 联络员
        liaisonPhone: '', // 联络员联系电话
        isCoop: '', // 是否配合
        isCoops: ['是','否'], // 是否配合选项
        showPickerIsCoop: false, // 显示是否配合选择
        temperatureInfo: '', // 体温检测
        temperatureInfos: ['是','否'], // 体温检测选项
        showPickerTemperatureInfo: false, // 显示体温检测选择
        healthyInfo: '', // 健康情况
        healthyInfos: ['正常','发热','咳嗽','无力'], // 健康情况
        showPickerHealthyInfo: false, // 显示健康情况选择
        isolatedLocation: '', // 隔离（留观）地点
        remark: '', // 备注

        infoCollapse: ['info'], // 手风琴默认展开 item 对应的 name 属性

        currentDate: new Date(),       // 当前日期
        minDate: new Date(2020, 0, 1), // 限制最小日期
        maxDate: new Date(2020, 3, 1), // 限制最大日期
        
        tit: '疫情期间公人员流动情况动态调查......'
      }
    },
    methods: {
      timeFormatDay(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        return year + '-' + month + '-' + day;
      },
      // 性别
      onConfirmGender(value) {
        this.gender = value;
        this.showPickerGender = false;
      },
      // 来深时间
      confirmArrivalDate(index) {
        this.arrivalDate = this.timeFormatDay(this.currentDate);
        this.showPickerArrivalDate = false
      },
      // 离深时间
      confirmLeaveDate(index) {
        this.leaveDate = this.timeFormatDay(this.currentDate);
        this.showPickerLeaveDate = false
      },
      // 停留时间
      confirmResetTime(index) {
        this.restTime = this.timeFormatDay(this.currentDate);
        this.showPickerRestTime = false;
      },
      // 是否停留
      onConfirmIsRest(value) {
        this.isRest = value;
        this.showPickerIsRest = false;
      },
      // 是否配合
      onConfirmIsCoop(value) {
        this.isCoop = value;
        this.showPickerIsCoop = false;
      },
      // 体温监测
      onConfirmTemperatureInfo(value) {
        this.temperatureInfo = value;
        this.showPickerTemperatureInfo = false;
      },
      // 健康情况
      onConfirmHealthyInfo(value) {
        this.healthyInfo = value;
        this.showPickerHealthyInfo = false;
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
          street: this.street,
          community: this.community,
          username: this.username,
          idCard: this.idCard,
          domicile: this.domicile,
          gender: this.gender,
          age: this.age,
          telephone: this.telephone,
          residence: this.residence,
          arrivalDate: this.arrivalDate,
          leaveDate: this.leaveDate,
          vehicle: this.vehicle,
          isRest: this.isRest,
          restTime: this.restTime,
          restLocation: this.restLocation,
          followerName: this.followerName,
          destinationAddress: this.destinationAddress,
          liaison: this.liaison,
          liaisonPhone: this.liaisonPhone,
          isCoop: this.isCoop,
          temperatureInfo: this.temperatureInfo,
          healthyInfo: this.healthyInfo,
          isolatedLocation: this.isolatedLocation,
          remark: this.remark,
        };

        axios.post(`${API_GATEWAY}/question/community/saveInfo`, params, {
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
        if (!this.street || !this.community || !this.username || !this.idCard) {
          Toast.fail('请将基本信息必填项填写完整');
          return;
        }
        this.submitBaseData();
      },
      // 获取基础信息
      getUserBaseInfo() {
        axios.get(`${API_GATEWAY}/question/community/getUserOriginInfo?idCard=${this.idCard}`, {
          headers: {
            'X-TenantId': this.tenantId
          }}).then(res => {
            if (res.status == 200 && !!res.data) {
              let data = res.data

              this.companyName = data.companyName;
              this.street = data.street;
              this.community = data.community;
              this.username = data.username;
              this.idCard = data.idCard;
              this.domicile = data.domicile;
              this.gender = data.gender;
              this.age = data.age;
              this.telephone = data.telephone;
              this.residence = data.residence;
              this.arrivalDate = data.arrivalDate;
              this.leaveDate = data.leaveDate;
              this.vehicle = data.vehicle;
              this.isRest = data.isRest;
              this.restTime = data.restTime;
              this.restLocation = data.restLocation;
              this.followerName = data.followerName;
              this.destinationAddress = data.destinationAddress;
              this.liaison = data.liaison;
              this.liaisonPhone = data.liaisonPhone;
              this.isCoop = data.isCoop;
              this.temperatureInfo = data.temperatureInfo;
              this.healthyInfo = data.healthyInfo;
              this.isolatedLocation = data.isolatedLocation;
              this.remark = data.remark;
            } else {

            }
        })
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
      }
    },
    mounted() {
      this.TitleScrolling();
      this.tenantId = this.$route.query.tenantId || JSON.parse(window.localStorage.getItem('user')).tenantId;
      Dialog.alert({
        title: '尊敬的各位欣家人：新年好！',
        message: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp随着武汉新型冠状病毒肺炎疫情的爆发蔓延，牵动着每一位中国人的心，为尽快尽早彻底打赢这场防控疫情的战争' +
          '争取早日复工复学，让社会秩序一切恢复正常。' +
          '公司设置本调查问卷，请大家务必真实详尽的填写，这将是对我们最大的支持和帮助，非常感谢！\n <h5>【公司会对信息进行严格保密，请大家放心填写】</h5>'
      }).then(() => {
        // on close
      });
      this.getCompanyName();
    },
    // 创建前设置 设置body滚动
    beforeCreate () {
      document.querySelector('body').setAttribute('style', 'overflow: auto;');
    },
    // 销毁前清除
    beforeDestroy () {
      document.querySelector('body').removeAttribute('style');
    }
  }
</script>
<style scoped>
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

