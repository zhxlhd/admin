<template>
  <div>
    <van-collapse v-model="infoCollapse" accordion class="coll cell_text_center">
      <van-collapse-item title="基本信息" name="info">
        <!-- <van-field
          disabled
          label="当前定位"
          :value="position?(position.province+position.city):'定位中'"
        /> -->

        <!-- <van-field
          readonly
          clickable
          required
          label="人员属性"
          placeholder="请选择"
          :value="personType"
          @click="showPickerPersonType = true"
        /> -->
        <van-field
          v-model="userNo"
          required
          label="工号"
          placeholder="请输入工号"
          @blur="getUserBaseInfo"
        />
        <van-field
          v-model="uname"
          required
          label="姓名"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="dept1"
          required
          label="一级部门"
          placeholder="请输入部门"
        />
        <van-field
          v-model="dept2"
          required
          label="二级部门"
          placeholder="请输入部门"
        />
        <van-field
          v-model="tel"
          required
          type="tel"
          label="联系电话"
          placeholder="请输入联系电话"
        />
        <!-- <van-field
          readonly
          clickable
          required
          label="工作地"
          :value="workPlace"
          placeholder="选择园区"
          @click="showPickerWorkPlace = true"
        /> -->
        
        <van-field
          v-model="workPlace"
          required
          label="工作地"
          placeholder="请输入工作地"
        />

        <van-field
          v-model="personCompany"
          required
          label="所属公司名字"
          placeholder="请输入"
          v-show="personType=='供应商驻厂人员' || personType=='客户' || personType=='供应商'"
        />
        <van-field
          v-model="personIDCard"
          required
          label="身份证号"
          placeholder="请输入"
          v-show="personType=='供应商驻厂人员' || personType=='客户' || personType=='供应商'"
        />
        <van-field
          v-model="personComeReason"
          required
          label="来访事由"
          placeholder="请输入"
          v-show="personType=='供应商驻厂人员' || personType=='客户' || personType=='供应商'"
        />
        <van-field
          readonly
          clickable
          label="已按要求佩戴口罩"
          :value="personKz"
          required
          v-show="personType=='供应商驻厂人员' || personType=='客户' || personType=='供应商'"
          placeholder="请选择"
          @click="showPickerPersonKz = true"
        />
        <van-field
          readonly
          required
          clickable
          v-show="personType=='供应商驻厂人员' || personType=='客户' || personType=='供应商'"
          label="承诺已学习、掌握并遵循欣旺达疫情防控指挥部发文及相关规则"
          :value="personLearn"
          placeholder="请选择"
          @click="showPickerPersonLearn = true"
        />

        <van-field
          v-model="zhuwai"
          label="驻外地址"
          placeholder="请输入驻外地址"
          v-show="isShowZhuWai"
        />


        <van-field
          readonly
          clickable
          label="出生籍贯"
          placeholder="选择籍贯"
          :value="jiguan"
          @click="showPickerJiguan = true"
        />

        <van-field
          v-model="idAddress"

          label="身份证地址"
          placeholder="请输入身份证地址"
        />

        <van-field
          readonly
          clickable

          label="工作地常居住房情况"
          :value="workLive"
          placeholder="选择工作地常居住房情况"
          @click="showPickerWorkLive = true"
        />

        <van-field
          v-model="workLiveAddress"
          label="住房地址"
          placeholder="请输入住房地址（详细到小区和房号）"
        />

        <van-field
          readonly
          clickable
          label="工作地上下班交通"
          :value="workTraffic"
          placeholder="选择工作地上下班交通"
          @click="showPickerWorkTraffic = true"
        />
        <van-field
          v-model="workTrafficInfo"
          label="工作地上下班交通说明"
          :placeholder="workTrafficHolder"
          :value="workTrafficInfo"
          type="textarea"
          v-show="workTraffic=='自驾自有私家车' || workTraffic=='公司班车' || workTraffic=='公交车'"
        />

        <van-field
          readonly
          clickable

          label="婚姻状况"
          :value="hunYin"
          placeholder="选择婚姻状况"
          @click="showPickerHunYin = true"
        />

        <!--        <van-field-->
        <!--          v-model="poName"-->
        <!--          label="配偶姓名"-->

        <!--          placeholder=""-->
        <!--          v-show="isShowYiHun"-->
        <!--        />-->
        <!--        <van-field-->
        <!--          readonly-->
        <!--          clickable-->
        <!--          label="配偶籍贯"-->
        <!--          placeholder="选择配偶籍贯"-->
        <!--          :value="poAddress"-->
        <!--          @click="showPickerJiguanPo = true"-->
        <!--          v-show="isShowYiHun"-->
        <!--        />-->

        <!--        <van-field-->
        <!--          v-model="poTel"-->
        <!--          label="配偶电话"-->
        <!--          type="tel"-->

        <!--          placeholder=""-->
        <!--          v-show="isShowYiHun"-->
        <!--        />-->

      </van-collapse-item>

      <van-collapse-item title="返工情况" name="fangong">
        <van-field
          v-model="kz1"
          label="普通一次性外科口罩数量"
          type="number"
          placeholder="请填写数量"
        />
        <van-field
          v-model="kz2"
          label="N95口罩数量"
          type="number"
          placeholder="请填写数量"
        />
        <van-field
          v-model="kz3"
          label="其他口罩数量"
          type="number"
          placeholder="请填写数量"
        />

        <van-field
          readonly
          clickable
          label="是否返回工作地"
          :value="isBack"
          placeholder="请选择"
          @click="showPickerIsBack = true"
        />


        <van-field
          v-model=backDate
          v-show="isBack=='否'"
          label="计划返回日期"
          required
          readonly
          placeholder="请选择"
          @click="showPickerBackDate = true"
        />
        <van-field
          required
          v-show="isBack=='否'"
          v-model="backTraffic"
          label="返回交通工具"
          placeholder="请填写"
        />
        <van-field
          v-model="backTrafficInfo"
          label="交通工具详情"
          v-show="isBack=='否'"
          placeholder="车次/航班号"
        />


        <van-field
          readonly
          clickable
          label="2月10日是否可正常复工"
          required
          :value="canWork"
          placeholder="请选择"
          @click="showPickerCanWork = true"
        />

        <van-field
          required
          v-show="canWork=='否'"
          v-model="cannotReason"
          label="不能复工原因"
          placeholder="请填写"
        />
        <van-field
          v-model=planWorkDate
          v-show="canWork=='否'"
          label="计划上班日期"
          required
          readonly
          placeholder="请选择"
          @click="showPickerWorkDate = true"
        />

        <van-field
          readonly
          clickable
          label="是否清楚复工时间(2月10日)、复工要求、提前复工的相关薪资福利政策或得知途径"
          required
          :value="isKnowRule"
          placeholder="请选择"
          @click="showPickerIsKnowRule = true"
        />

        <van-field
          readonly
          clickable
          label="你的主管领导放假期间是否有跟你联系"
          required
          :value="isLeaderContact"
          placeholder="请选择"
          @click="showPickerIsLeaderContact = true"
        />

        <van-field
          required
          v-show="isLeaderContact=='是'"
          v-model="isLeaderContactCount"
          label="联系过几次"
          type="number"
          placeholder="请填写次数"
        />
        <van-field
          required
          v-show="isLeaderContact=='是'"
          v-model="isLeaderContactLastDate"
          label="最后一次联系时间"
          readonly
          placeholder="请选择日期"
          @click="showPickerLastContactDate = true"

        />

        <van-field
          v-model="question"
          rows="4"
          autosize
          label="你当前面临的最大问题是什么？你需要什么帮助？"
          type="textarea"
          placeholder="请输入"
        />

      </van-collapse-item>

      <van-collapse-item title="家庭成员信息" name="zinv">

        <van-field
          readonly
          clickable
          required
          label="父亲状况"
          :value="fatherState"
          placeholder="请选择"
          @click="showPickerFather = true"
        />

        <van-field
          v-model="fatherName"
          label="父亲姓名"
          v-show="false"
          placeholder="请输入父亲姓名"
        />
        <van-field
          v-model="fatherAge"
          label="父亲年龄"
          v-show="fatherState=='健在'"
          placeholder="请输入父亲年龄"
        />
        <van-field
          readonly
          clickable
          v-show="fatherState=='健在'"
          label="父亲籍贯"
          placeholder="选择父亲籍贯"
          :value="jiguan1"
          @click="showPickerJiguan1 = true"
        />

        <van-field
          readonly
          clickable
          v-show="false"
          label="父亲工作地"
          placeholder="请选择父亲工作地"
          :value="jiguan2"
          @click="showPickerJiguan2 = true"
        />

        <van-field
          readonly
          clickable
          v-show="fatherState=='健在'"
          label="父亲居住地"
          placeholder="请选择父亲居住地"
          :value="jiguan3"
          @click="showPickerJiguan3 = true"
        />

        <!-- 新增开始 -->
        <van-field
          readonly
          clickable
          v-show="fatherState=='健在'"
          label="父亲是否退休"
          :value="isFRetire"
          placeholder="请选择"
          @click="showPickerisFRetire = true"
        />
        <!-- 结束 -->
        <van-field
          v-model="fatherTel"
          label="父亲电话"
          type="tel"
          v-show="fatherState=='健在'"
          placeholder="请输入父亲电话"
        />

        <van-field
          style="margin-top: 20px"
          readonly
          clickable
          required
          label="母亲状况"
          :value="motherState"
          placeholder="请选择"
          @click="showPickerMother = true"
        />
        <van-field
          v-model="motherName"
          label="母亲姓名"
          v-show="false"
          placeholder="请输入母亲姓名"
        />
        <van-field
          v-model="motherAge"
          label="母亲年龄"
          v-show="motherState=='健在'"
          placeholder="请输入母亲年龄"
        />
        <van-field
          readonly
          clickable
          v-show="motherState=='健在'"
          label="母亲籍贯"
          placeholder="请选择母亲籍贯"
          :value="jiguan7"
          @click="showPickerJiguan7 = true"
        />

        <van-field
          readonly
          clickable
          v-show="false"
          label="母亲工作地"
          placeholder="请选择母亲工作地"
          :value="motherWorkPlace"
          @click="showPickerJiguan5 = true"
        />

        <van-field
          readonly
          clickable
          v-show="motherState=='健在'"
          label="母亲居住地"
          placeholder="请选择母亲居住地"
          :value="jiguan6"
          @click="showPickerJiguan6 = true"
        />

        <!-- 新增开始 -->
        <van-field
          readonly
          clickable
          v-show="motherState=='健在'"
          label="母亲是否退休"
          :value="isMRetire"
          placeholder="请选择"
          @click="showPickerisMRetire = true"
        />
        <!-- end -->

        <van-field
          v-model="motherTel"
          label="母亲电话"
          type="tel"
          v-show="motherState=='健在'"
          placeholder="请输入母亲电话"
        />

        <!-- 新增start -->
        <div v-show="isShowYiHun">

          <van-field
            style="margin-top: 20px"
            required
            v-model="spouseName"
            label="配偶姓名"
            placeholder="请输入配偶姓名"
          />
          <van-field
            v-model="spouseAge"
            label="配偶年龄"
            placeholder="请输入配偶年龄"
          />
          <van-field
            readonly
            clickable
            label="配偶籍贯"
            placeholder="请选择配偶籍贯"
            :value="spouseNative"
            @click="showPickerspouseNative = true"
          />
          <van-field
            v-model="spouseAddress"
            label="配偶身份证地址"
            placeholder="请输入配偶身份证地址"
          />
          <van-field
            readonly
            clickable
            label="配偶工作情况"
            :value="spouseWork"
            placeholder="请选择"
            @click="showPickerspouseWork = true"
          />
          <van-field
            v-model="spouseworkCompany"
            v-show="spouseWork === '上班'"
            label="配偶工作公司名称"
            placeholder="请输入配偶工作公司名称"
          />
          <van-field
            readonly
            clickable
            label="配偶工作地址"
            v-show="spouseWork === '上班'"
            placeholder="请选择配偶工作地址"
            :value="spouseworkAddress"
            @click="showPickerspouseworkA = true"
          />
          <van-field
            readonly
            clickable
            required
            style="margin-top: 20px"
            label="配偶父亲状况"
            :value="sfatherState"
            placeholder="请选择"
            @click="showPickersFather = true"
          />
          <van-field
            v-model="sfatherName"
            label="配偶父亲姓名"
            v-show="false"
            placeholder="请输入配偶父亲姓名"
          />
          <van-field
            v-model="sfatherAge"
            label="配偶父亲年龄"
            v-show="sfatherState=='健在'"
            placeholder="配偶请输入父亲年龄"
          />
          <van-field
            readonly
            clickable
            v-show="sfatherState=='健在'"
            label="配偶父亲籍贯"
            placeholder="选择配偶父亲籍贯"
            :value="sjiguan1"
            @click="showPickersJiguan1 = true"
          />
          <van-field
            readonly
            clickable
            v-show="false"
            label="配偶父亲工作地"
            placeholder="请选择配偶父亲工作地"
            :value="sjiguan2"
            @click="showPickersJiguan2 = true"
          />
          <van-field
            readonly
            clickable
            v-show="sfatherState=='健在'"
            label="配偶父亲居住地"
            placeholder="请选择配偶父亲居住地"
            :value="sjiguan3"
            @click="showPickersJiguan3 = true"
          />
          <van-field
            readonly
            clickable
            v-show="sfatherState=='健在'"
            label="配偶父亲是否退休"
            :value="sisFRetire"
            placeholder="请选择"
            @click="showPickersisFRetire = true"
          />
          <van-field
            v-model="sfatherTel"
            label="配偶父亲电话"
            type="tel"
            v-show="sfatherState=='健在'"
            placeholder="请输入配偶父亲电话"
          />
          <van-field
            style="margin-top: 20px"
            readonly
            clickable
            required
            label="配偶母亲状况"
            :value="smotherState"
            placeholder="请选择"
            @click="showPickersMother = true"
          />
          <van-field
            v-model="smotherName"
            label="配偶母亲姓名"
            v-show="false"
            placeholder="请输入配偶母亲姓名"
          />
          <van-field
            v-model="smotherAge"
            label="配偶母亲年龄"
            v-show="smotherState=='健在'"
            placeholder="请输入配偶母亲年龄"
          />
          <van-field
            readonly
            clickable
            v-show="smotherState=='健在'"
            label="配偶母亲籍贯"
            placeholder="请选择配偶母亲籍贯"
            :value="sjiguan7"
            @click="showPickersJiguan7 = true"
          />
          <van-field
            readonly
            clickable
            v-show="false"
            label="配偶母亲工作地"
            placeholder="请选择配偶母亲工作地"
            :value="smotherWorkPlace"
            @click="showPickersJiguan5 = true"
          />
          <van-field
            readonly
            clickable
            v-show="smotherState=='健在'"
            label="配偶母亲居住地"
            placeholder="请选择配偶母亲居住地"
            :value="sjiguan6"
            @click="showPickersJiguan6 = true"
          />
          <van-field
            readonly
            clickable
            v-show="smotherState=='健在'"
            label="配偶母亲是否退休"
            :value="sisMRetire"
            placeholder="请选择"
            @click="showPickersisMRetire = true"
          />
          <van-field
            v-model="smotherTel"
            label="配偶母亲电话"
            type="tel"
            v-show="smotherState=='健在'"
            placeholder="请输入配偶母亲电话"
          />
        </div>
        <!-- end -->

        <van-field
          readonly
          style="margin-top: 20px"
          clickable
          label="是否有子女"
          :value="zinv"
          placeholder="选择子女情况"
          @click="showPickerZiNv = true"
        />
        <div v-for='(children,index) in childrens' :key="index">
          <van-field
            v-model=children.name1
            label="子女姓名"
            placeholder="请输入子女姓名"
            v-show="isShowZiNv"
          />
          <van-field
            v-model=children.name4 v-show="isShowZiNv"
            readonly
            label="子女出生年月"
            placeholder="请输入子女出生年月"
            @click="showPickerZiNvBirth = true"
          />
          <van-popup v-model="showPickerZiNvBirth" position="bottom">
            <van-datetime-picker
              @confirm="confirmDateTime(index)"
              @cancel="showPickerZiNvBirth=false"
              v-model="currentDate"
              :min-date="minDate"
              :max-date="maxDate"
              type="year-month"
            />
          </van-popup>
          <!-- 新增start -->
          <van-field
            v-model=children.name5 v-show="isShowZiNv"
            readonly
            label="子女学习/工作情况"
            placeholder="请选择"
            @click="showPickerZiNvStatus = true; zinvindex = index"
          />
          <!-- end -->

          <van-field
            v-model=children.name2 v-show="isShowZiNv"
            label="学校名称或者工作地址"

            placeholder="请输入子女学校名称或者工作地址"
          />

          <van-field
            v-model=children.name3 v-show="isShowZiNv" type="tel"
            label="子女电话"
            placeholder="请输入子女电话"
          />

          <div v-show="isShowZiNv" style="height: 10px; background-color: lightgray;"></div>
        </div>
        <button type="warning" @click="addChildren" v-show="isShowZiNv">添加子女</button>
        <button type="danger" @click="delChildren" v-show="isShowZiNv">删除子女</button>
      </van-collapse-item>
    </van-collapse>


    <span class="span-title">行程完善</span>
    <van-collapse v-model="activeNames" accordion v-for="(day,index) in dailys" :key="day.dDate" class="cell_text_center">

      <van-collapse-item :title="dailys[index].dDate" :name="index">
        <van-cell-group>
          <van-cell title="复制类同日程信息" :value="dailys[index].copydate"
                    @click="copyCom();copyselIndex = index;copyselDate = dailys[index].dDate"/>
          <van-calendar
            v-model="copyshow"
            :min-date="copyminDate"
            @confirm="onConfirmCopyDate"
          />
          <!-- start -->
          <van-field
            readonly
            clickable
            required
            label="居住所在地"
            v-model="dailys[index].dacity"
            placeholder="选择"
            @click="showPickerdacity = true; dacityindex = index"
          />
          <van-field
            placeholder="街道/村镇 小区名字/村镇名字/或公司宿舍栋号和宿舍号（这里包含公司的人才廉租房）/酒店（酒店名称）"
            type="textarea"
            v-model="dailys[index].dAddress"
          />
          <!-- end -->
          <van-field
            readonly
            clickable
            required
            label="居住房类型"
            v-model="dailys[index].dAddressType"
            placeholder="选择居住房类型"
            @click="showPickerLiveType = true"
          />

          <van-field
            readonly
            clickable
            label="当日居住地是否已划分为疫区"
            :value="dailys[index].dIsYiQu"
            placeholder="请选择"
            @click="showPickerIsYiQu = true"
          />
          <!-- start -->

          <van-field
            readonly
            clickable
            label="自己小区、社区、村是否有感染确诊人员或疑似人员的"
            :value="dailys[index].dIsInfect"
            placeholder="请选择"
            @click="showPickerIsInfect = true"
          />
          <!-- end -->

          <van-field
            label="有多少人确诊"
            placeholder="请填写确诊人数，没有则填0"
            v-model="dailys[index].dPaintCount"
            type="number"
            v-show="false"
            required
          />

          <van-field
            readonly
            clickable
            required
            label="当日自己身体状况"
            v-model="dailys[index].dHealth"
            placeholder="请选择"
            @click="showPickerHealth = true"
          />

          <van-field
            label="当日自己身体状况"
            placeholder="说明什么情况"
            v-model="dailys[index].dHealthWhy"
            required
            v-show="dailys[index].dHealth=='异常'"
          />
          <van-field
            label="当日测量体温"
            v-model="dailys[index].dTemplete"
            placeholder="请输入当日体温"
            required
          />
          <!-- start -->
          <van-field
            readonly
            clickable
            required
            v-model="dailys[index].dArea"
            label="是否到过重点疫情区域（周转、经停过、进过高速服务区的）"
            placeholder="请选择"
            @click="showPickerDarea = true"
          />
          <van-field
            readonly
            clickable
            required
            v-model="dailys[index].dIsolate"
            label="是否居家隔离"
            placeholder="请选择"
            @click="showPickerdIsolate = true"
          />
          <van-field
            label="居家隔离天数"
            v-show="dailys[index].dIsolate === '是'"
            v-model="dailys[index].disolateDay"
            placeholder="请输入居家隔离天数"
            required
          />
          <!-- end -->
          <van-field
            readonly
            clickable
            required
            v-model="dailys[index].dIsOut"
            label="是否有外出"
            placeholder="选择是否有外出"
            @click="showPickerIsOut = true"
          />
          <van-field
            v-model="dailys[index].dOutReason"
            label="外出事项"
            required
            placeholder="请输入外出事项"
            v-show="dailys[index].dIsOut=='是'"
          />
          <!-- start -->
          <van-field
            readonly
            v-model="dailys[index].dOutPlace"
            label="外出地点"
            placeholder="请选择外出地点"
            v-show="dailys[index].dIsOut=='是'"
            required
            @click="showPickerOutPlace = true"
          />
          <van-field
            readonly
            label="出行交通"
            v-model="dailys[index].dOutTraffic"
            placeholder="请选择出行交通"
            @click="showPickerdOutTraffic = true"
            v-show="dailys[index].dIsOut=='是'"
            required
          />
          <!-- end -->
          <van-field
            readonly
            clickable
            required
            v-model="dailys[index].dParty"
            label="集会/聚会情况"
            placeholder="选择集会/聚会情况"
            @click="showPickerJuHui = true"
          />

          <van-field
            required
            v-model="dailys[index].dPartyPlace"
            label="聚会地点"
            placeholder="填写聚会地点"
            v-show="dailys[index].dParty=='参加了10人以上聚会'"
          />
          <van-field
            required
            v-model="dailys[index].dPartyType"
            label="聚会类别"
            placeholder="家庭聚会、同学聚会、婚宴、丧宴、朋友聚会、同事聚会"
            v-show="dailys[index].dParty=='参加了10人以上聚会'"
          />
          <!-- start -->
          <van-field
            label="接触的群体是否有来自湖北的人员"
            v-model="dailys[index].dAttach"
            placeholder="请选择"
            required
            readonly
            @click="showPickerdAttach = true"
          />
          <van-field
            label="说明姓名和截止调查日的身体异常状况"
            v-model="dailys[index].dAttDetail"
            v-show="dailys[index].dAttach === '有'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <van-field
            label="自有车辆借出情况"
            v-model="dailys[index].dCarBorrow"
            placeholder="请选择"
            required
            readonly
            @click="showPickerdCarBorrow = true"
          />
          <van-field
            label="说明借出是否给重点疫情地区人员，已归还并使用还是已归还未使用或未归还"
            v-model="dailys[index].dCarDetail"
            v-show="dailys[index].dCarBorrow === '借出'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <van-field
            label="当日接触高风险人群情况"
            v-model="dailys[index].dAttachHigh"
            placeholder="请选择"
            @click="showPickerdAttachHigh = true"
            readonly
            required
          />
          <van-field
            label="当日居住"
            v-model="dailys[index].dSleepTogather"
            placeholder="请选择"
            @click="showPickerdSleepTogather = true"
            readonly
            required
          />
          <van-field
            label="室友分别是 谁，联系方式、当日身体状况"
            v-model="dailys[index].dSleepDetail"
            v-show="dailys[index].dSleepTogather === '公司集体宿舍'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <van-field
            label="分别是哪些人如配偶、朋友、子女、父母等、当日身体状况"
            v-model="dailys[index].dSleepDetail"
            v-show="dailys[index].dSleepTogather === '家人'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <van-field
            label="当日身体状况"
            v-model="dailys[index].dSleepDetail"
            v-show="dailys[index].dSleepTogather === '合租'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <van-field
            label="当日在家接待来访亲友情况"
            v-model="dailys[index].dHomeFriend"
            @click="showPickerdHomeFriend = true"
            readonly
            placeholder="请选择"
            required
          />
          <van-field
            label="来访人员身体情况、来访多少人、是否有高风险疫区人员、是否有身体异常情况人员、这类人群分别来自哪里、是否有来自高风险疫区人员"
            v-model="dailys[index].dHomeFriendDetail"
            v-show="dailys[index].dHomeFriend === '有'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <van-field
            label="自己或密切接触家人所接触到的人群确诊为病例的人员情况"
            v-model="dailys[index].dAttachHow"
            @click="showPickerdAttachHow = true"
            readonly
            placeholder="请选择"
            required
          />
          <van-field
            label="谁，请说明"
            v-model="dailys[index].dAttachHowDetail"
            v-show="dailys[index].dAttachHow === '有确诊病例' || dailys[index].dAttachHow === '有身体异常人员（异常状况：发热、干咳）' || dailys[index].dAttachHow === '有疑似病例'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <van-field
            label="当日用餐情况"
            v-model="dailys[index].dEat"
            @click="showPickerdEat = true"
            placeholder="请选择"
            required
          />
          <van-field
            label="外部用餐地点"
            v-model="dailys[index].dEatDetail"
            v-show="dailys[index].dEat === '外部用餐'"
            type="textarea"
            placeholder="请输入"
            required
          />
          <!-- end -->
        </van-cell-group>
      </van-collapse-item>

    </van-collapse>


    <!-- 弹出层 -->
    <div>

      <van-popup v-model="showPickerJiguan6" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="母亲居住地" @confirm="onConfirmJiguan6"
                  @cancel="showPickerJiguan6 = false" @change="onChangeJiguan"/>
      </van-popup>

      <van-popup v-model="showPickersJiguan6" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="配偶母亲居住地" @confirm="onConfirmsJiguan6"
                  @cancel="showPickersJiguan6 = false" @change="onChangeJiguan"/>
      </van-popup>


      <van-popup v-model="showPickerZiNvStatus" position="bottom">
        <van-picker
          show-toolbar
          :columns="zinvStatus"
          @cancel="showPickerZiNvStatus = false; zinvindex = null"
          @confirm="onConfirmzinvStatus"
        />
      </van-popup>
      <van-popup v-model="showPickersJiguan5" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="配偶母亲工作地" @confirm="onConfirmsJiguan5"
                  @cancel="showPickersJiguan5 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickersJiguan7" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="配偶母亲籍贯" @confirm="onConfirmsJiguan7"
                  @cancel="showPickersJiguan7 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickerspouseNative" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="配偶籍贯" @confirm="onConfirmspouseNative"
                  @cancel="showPickerspouseNative = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickerspouseworkA" position="bottom">
        <van-area :area-list="areaList" :columns-num="3" title="配偶工作地" @confirm="onConfirmspouseworkA"
                  @cancel="showPickerspouseworkA = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickersJiguan3" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="配偶父亲居住地" @confirm="onConfirmsJiguan3"
                  @cancel="showPickersJiguan3 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickersJiguan2" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="配偶父亲工作地" @confirm="onConfirmsJiguan2"
                  @cancel="showPickersJiguan2 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickersJiguan1" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="配偶父亲籍贯" @confirm="onConfirmsJiguan1"
                  @cancel="showPickersJiguan1 = false" @change="onChangeJiguan"/>
      </van-popup>

      <van-popup v-model="showPickerJiguan5" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="母亲工作地" @confirm="onConfirmJiguan5"
                  @cancel="showPickerJiguan5 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickerJiguan7" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="母亲籍贯" @confirm="onConfirmJiguan7"
                  @cancel="showPickerJiguan7 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickerJiguan3" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="父亲居住地" @confirm="onConfirmJiguan3"
                  @cancel="showPickerJiguan3 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickerJiguan2" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="父亲工作地" @confirm="onConfirmJiguan2"
                  @cancel="showPickerJiguan2 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickerJiguan1" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="父亲籍贯" @confirm="onConfirmJiguan1"
                  @cancel="showPickerJiguan1 = false" @change="onChangeJiguan"/>
      </van-popup>
      <van-popup v-model="showPickerLastContactDate" position="bottom">
        <van-datetime-picker
          @confirm="confirmDateTimeLastContact()"
          @cancel="showPickerLastContactDate=false"
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
        />
      </van-popup>
      <van-popup v-model="showPickerIsLeaderContact" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickerIsLeaderContact = false"
          @confirm="onConfirmIsLeaderContact"
        />
      </van-popup>
      <van-popup v-model="showPickerisLeaderContactCount" position="bottom">
        <van-picker
          show-toolbar
          :columns="isLeaderContactCounts"
          @cancel="showPickerisLeaderContactCount = false"
          @confirm="onConfirmisLeaderContactCounts"
        />
      </van-popup>
      <van-popup v-model="showPickerIsKnowRule" position="bottom">
        <van-picker
          show-toolbar
          :columns="isKnowRules"
          @cancel="showPickerIsKnowRule = false"
          @confirm="onConfirmIsKnowRule"
        />
      </van-popup>
      <van-popup v-model="showPickerWorkDate" position="bottom">
        <van-datetime-picker
          @confirm="confirmDateTimeWork()"
          @cancel="showPickerWorkDate=false"
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
        />
      </van-popup>
      <van-popup v-model="showPickerCanWork" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickerCanWork = false"
          @confirm="onConfirmCanWork"
        />
      </van-popup>
      <van-popup v-model="showPickerbackTraffic" position="bottom">
        <van-picker
          show-toolbar
          :columns="backTraffics"
          @cancel="showPickerbackTraffic = false"
          @confirm="onConfirmbackTraffics"
        />
      </van-popup>
      <van-popup v-model="showPickerbackTrafficInfo" position="bottom">
        <van-picker
          show-toolbar
          :columns="backTrafficInfos"
          @cancel="showPickerbackTrafficInfo = false"
          @confirm="onConfirmbackTrafficInfos"
        />
      </van-popup>
      <van-popup v-model="showPickerBackDate" position="bottom">
        <van-datetime-picker
          @confirm="confirmDateTimeDay()"
          @cancel="showPickerBackDate=false"
          v-model="currentDate"
          :min-date="minDate"
          :max-date="maxDate"
          type="date"
        />
      </van-popup>
      <van-popup v-model="showPickerIsBack" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickerIsBack = false"
          @confirm="onConfirmIsBack"
        />
      </van-popup>

      <van-popup v-model="showPickerisFRetire" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickerisFRetire = false"
          @confirm="onConfirmisFRetire"
        />
      </van-popup>
      <van-popup v-model="showPickersisFRetire" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickersisFRetire = false"
          @confirm="onConfirmsisFRetire"
        />
      </van-popup>
      <van-popup v-model="showPickerisMRetire" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickerisMRetire = false"
          @confirm="onConfirmisMRetire"
        />
      </van-popup>
      <van-popup v-model="showPickersisMRetire" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickersisMRetire = false"
          @confirm="onConfirmsisMRetire"
        />
      </van-popup>
      <van-popup v-model="showPickerdAttach" position="bottom">
        <van-picker
          show-toolbar
          :columns="dAttachs"
          @cancel="showPickerdAttach = false"
          @confirm="onConfirmdAttach"
        />
      </van-popup>
      <van-popup v-model="showPickerdCarBorrow" position="bottom">
        <van-picker
          show-toolbar
          :columns="dCarBorrows"
          @cancel="showPickerdCarBorrow = false"
          @confirm="onConfirmdCarBorrow"
        />
      </van-popup>
      <van-popup v-model="showPickerspouseWork" position="bottom">
        <van-picker
          show-toolbar
          :columns="Worksituation"
          @cancel="showPickerspouseWork = false"
          @confirm="onConfirmspouseWork"
        />
      </van-popup>

      <van-popup v-model="showPickerJiguanPo" position="bottom">
        <van-area :area-list="areaList" :columns-num="2" title="父亲居住地" @confirm="onConfirmJiguanPo"
                  @cancel="showPickerJiguanPo = false"/>
      </van-popup>
      <van-popup v-model="showPickerdacity" position="bottom">
        <van-area :area-list="areaList" :columns-num="3" title="居住地" @confirm="onConfirmdacity"
                  @cancel="showPickerdacity = false; dacityindex = null"/>
      </van-popup>
      <van-popup v-model="showPickerworkLiveCity" position="bottom">
        <van-area :area-list="areaList" :columns-num="3" title="居住地" @confirm="onConfirmworkLiveCity"
                  @cancel="showPickerworkLiveCity = false;"/>
      </van-popup>
      <van-popup v-model="showPickerJiguan" position="bottom">

        <van-area :area-list="areaList" :columns-num="2" title="籍贯" @confirm="onConfirmJiguan"
                  @cancel="showPickerJiguan = false" @change="onChangeJiguan"/>
      </van-popup>

      <van-popup v-model="showPickerWorkPlace" position="bottom">
        <van-picker
          show-toolbar
          :columns="workPlaces"
          @cancel="showPickerWorkPlace = false"
          @confirm="onConfirmWorkPlace"
        />
      </van-popup>

      <van-popup v-model="showPickerHunYin" position="bottom">
        <van-picker
          show-toolbar
          :columns="hunYins"
          @cancel="showPickerHunYin = false"
          @confirm="onConfirmHunYin"
        />
      </van-popup>

      <van-popup v-model="showPickerZiNv" position="bottom">
        <van-picker
          show-toolbar
          :columns="zinvs"
          @cancel="showPickerZiNv = false"
          @confirm="onConfirmZinv"
        />
      </van-popup>
      <van-popup v-model="showPickerWorkLive" position="bottom">
        <van-picker
          show-toolbar
          :columns="workLives"
          @cancel="showPickerWorkLive = false"
          @confirm="onConfirmWorkLive"
        />
      </van-popup>

      <van-popup v-model="showPickerWorkTraffic" position="bottom">
        <van-picker
          show-toolbar
          :columns="workTraffics"
          @cancel="showPickerWorkTraffic = false"
          @confirm="onConfirmWorkTraffic"
        />
      </van-popup>

      <van-popup v-model="showPickerLiveType" position="bottom">
        <van-picker
          show-toolbar
          :columns="liveTypes"
          @cancel="showPickerLiveType = false"
          @confirm="onConfirmLiveType"
        />
      </van-popup>
      <van-popup v-model="showPickerIsOut" position="bottom">
        <van-picker
          show-toolbar
          :columns="isOuts"
          @cancel="showPickerIsOut = false"
          @confirm="onConfirmIsOut"
        />
      </van-popup>
      <van-popup v-model="showPickerstorkDynamic" position="bottom">
        <van-picker
          show-toolbar
          :columns="isOuts"
          @cancel="showPickerstorkDynamic = false"
          @confirm="onConfirmstorkDynamic"
        />
      </van-popup>

      <van-popup v-model="showPickerDarea" position="bottom">
        <van-picker
          show-toolbar
          :columns="isOuts"
          @cancel="showPickerDarea = false"
          @confirm="onConfirmDarea"
        />
      </van-popup>
      <van-popup v-model="showPickerdIsolate" position="bottom">
        <van-picker
          show-toolbar
          :columns="isOuts"
          @cancel="showPickerdIsolate = false"
          @confirm="onConfirmdIsolate"
        />
      </van-popup>
      <van-popup v-model="showPickerOutPlace" position="bottom">
        <van-picker
          show-toolbar
          :columns="outPlace"
          @cancel="showPickerOutPlace = false"
          @confirm="onConfirmOutPlace"
        />
      </van-popup>
      <van-popup v-model="showPickerdAttachHigh" position="bottom">
        <van-picker
          show-toolbar
          :columns="attachHighs"
          @cancel="showPickerdAttachHigh = false"
          @confirm="onConfirmdAttachHigh"
        />
      </van-popup>
      <van-popup v-model="showPickerdSleepTogather" position="bottom">
        <van-picker
          show-toolbar
          :columns="dSleepTogather"
          @cancel="showPickerdSleepTogather = false"
          @confirm="onConfirmdSleepTogather"
        />
      </van-popup>
      <van-popup v-model="showPickerdHomeFriend" position="bottom">
        <van-picker
          show-toolbar
          :columns="dHomeFriend"
          @cancel="showPickerdHomeFriend = false"
          @confirm="onConfirmdHomeFriend"
        />
      </van-popup>
      <van-popup v-model="showPickerdAttachHow" position="bottom">
        <van-picker
          show-toolbar
          :columns="dAttachHows"
          @cancel="showPickerdAttachHow = false"
          @confirm="onConfirmdAttachHow"
        />
      </van-popup>
      <van-popup v-model="showPickerdEat" position="bottom">
        <van-picker
          show-toolbar
          :columns="dEats"
          @cancel="showPickerdEat = false"
          @confirm="onConfirmdEat"
        />
      </van-popup>
      <van-popup v-model="showPickerdHighPlace" position="bottom">
        <van-picker
          show-toolbar
          :columns="dHighPlaces"
          @cancel="showPickerdHighPlace = false"
          @confirm="onConfirmdHighPlaces"
        />
      </van-popup>
      <van-popup v-model="showPickerdWearMask" position="bottom">
        <van-picker
          show-toolbar
          :columns="isOuts"
          @cancel="showPickerdWearMask = false"
          @confirm="onConfirmdWearMask"
        />
      </van-popup>


      <van-popup v-model="showPickerdOutTraffic" position="bottom">
        <van-picker
          show-toolbar
          :columns="workTraffics"
          @cancel="showPickerdOutTraffic = false"
          @confirm="onConfirmOutTraffic"
        />
      </van-popup>
      <van-popup v-model="showPickerFather" position="bottom">
        <van-picker
          show-toolbar
          :columns="states"
          @cancel="showPickerFather = false"
          @confirm="onConfirmFather"
        />
      </van-popup>
      <van-popup v-model="showPickersFather" position="bottom">
        <van-picker
          show-toolbar
          :columns="states"
          @cancel="showPickersFather = false"
          @confirm="onConfirmsFather"
        />
      </van-popup>
      <van-popup v-model="showPickerMother" position="bottom">
        <van-picker
          show-toolbar
          :columns="states"
          @cancel="showPickerMother = false"
          @confirm="onConfirmMother"
        />
      </van-popup>
      <van-popup v-model="showPickersMother" position="bottom">
        <van-picker
          show-toolbar
          :columns="states"
          @cancel="showPickersMother = false"
          @confirm="onConfirmsMother"
        />
      </van-popup>
      <van-popup v-model="showPickersMother" position="bottom">
        <van-picker
          show-toolbar
          :columns="states"
          @cancel="showPickersMother = false"
          @confirm="onConfirmsMother"
        />
      </van-popup>
      <van-popup v-model="showPickerIsYiQu" position="bottom">
        <van-picker
          show-toolbar
          :columns="isYiQus"
          @cancel="showPickerIsYiQu = false"
          @confirm="onConfirmIsYiQu"
        />
      </van-popup>

      <van-popup v-model="showPickerIsInfect" position="bottom">
        <van-picker
          show-toolbar
          :columns="isYiQus"
          @cancel="showPickerIsInfect = false"
          @confirm="onConfirmIsInfect"
        />
      </van-popup>

      <van-popup v-model="showPickerHealth" position="bottom">
        <van-picker
          show-toolbar
          :columns="heal"
          @cancel="showPickerHealth = false"
          @confirm="onConfirmHealth"
        />
      </van-popup>
      <van-popup v-model="showPickerdTemplete" position="bottom">
        <van-picker
          show-toolbar
          :columns="dTempletes"
          @cancel="showPickerdTemplete = false"
          @confirm="onConfirmdTemplete"
        />
      </van-popup>
      <van-popup v-model="showPickerdHealthFamily" position="bottom">
        <van-picker
          show-toolbar
          :columns="heal"
          @cancel="showPickerdHealthFamily = false"
          @confirm="onConfirmdHealthFamily"
        />
      </van-popup>
      <van-popup v-model="showPickerJuHui" position="bottom">
        <van-picker
          show-toolbar
          :columns="juHuis"
          @cancel="showPickerJuHui = false"
          @confirm="onConfirmJuHui"
        />
      </van-popup>
      <van-popup v-model="showPickerdPartyType" position="bottom">
        <van-picker
          show-toolbar
          :columns="dPartyTypes"
          @cancel="showPickerdPartyType = false"
          @confirm="onConfirmdPartyTypes"
        />
      </van-popup>
      <van-popup v-model="showPickerdAreaStatus" position="bottom">
        <van-picker
          show-toolbar
          :columns="dAreaStatu"
          @cancel="showPickerdAreaStatus = false"
          @confirm="onConfirmdAreaStatu"
        />
      </van-popup>
      <van-popup v-model="showPickerPersonType" position="bottom">
        <van-picker
          show-toolbar
          :columns="personTypes"
          @cancel="showPickerPersonType = false"
          @confirm="onConfirmPersonType"
        />
      </van-popup>
      <van-popup v-model="showPickerPersonKz" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickerPersonKz = false"
          @confirm="onConfirmPersonKz"
        />
      </van-popup>

      <van-popup v-model="showPickerPersonLearn" position="bottom">
        <van-picker
          show-toolbar
          :columns="isBacks"
          @cancel="showPickerPersonLearn = false"
          @confirm="onConfirmPersonLearn"
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
  import areaListObj from './constant/area.js'

  export default {
    name: 'QuestionH5',
    data() {
      return {
        disbutton: true,
        usernoDs: false,
        Diashow: true,
        spinnershow: true,
        // start
        showPickerdTemplete: false,
        dTempletes: ['正常（37.3以下）', '异常（37.3以上）'],
        // end
        // 所有子女信息
        childrens: [
          {
            name1: '', name2: '', name3: '', name4: '', name5: ''
          }
        ],
        position: '',//定位json

        zinvCollapse: ['zinv'],
        infoCollapse: ['info'],

        isShowZhuWai: false,
        uname: '',
        tel: '',
        dept: '',
        dept1: '',
        dept2: '',
        userNo: '',
        idcard: '',

        personType: '公司正式员工',
        showPickerPersonType: false,
        personTypes: ['公司正式员工', '派遣工', '供应商驻场人员', '客户', '供应商', '园区内小公司', '园区内员工家属'],
        personKz: '',
        showPickerPersonKz: false,
        personLearn: '',
        showPickerPersonLearn: false,

        personCompany: '',
        personIDCard: '',
        personComeReason: '',
        personKz: '',
        personLearn: '',

        workPlace: '',
        showPickerWorkPlace: false,
        workPlaces: ['石龙仔', '光明', '惠州', '水田', 'F栋', '裕永兴', '燕罗', '南京', '塘尾', '下石家', '普耐', '金叶', '驻外'],
        zhuwai: '',

        fatherState: '健在',
        motherState: '健在',
        sfatherState: '健在',
        smotherState: '健在',
        showPickerFather: false,
        showPickerMother: false,
        states: ['健在', '已故'],

        idAddress: '',

        showPickerdacity: false,

        hunYin: '',
        showPickerHunYin: false,
        showPickerworkLiveCity: false,
        hunYins: ['已婚', '未婚', '其他'],
        isShowYiHun: false,
        poName: '',
        poAddress: '',
        poTel: '',

        workLiveCity: '',
        nlsheng: '',
        nlshi: '',

        kz1: '',
        kz2: '',
        kz3: '',

        isBack: '',
        showPickerIsBack: false,
        isBacks: ['是', '否'],
        backDate: '',
        backTraffic: '',
        showPickerbackTraffic: false,
        showPickerbackTrafficInfo: false,
        showPickerisLeaderContactCount: false,
        isLeaderContactCounts: ['0', '1', '2', '3', '3次以上'],
        backTrafficInfos: ['有确诊疫情病例', '有疑似疫情病例', '暂无显示有确诊疫情病例', '暂无显示有疑似疫情病例', '不适用'],
        backTraffics: ['在工作地未返回老家', '出游未返老家', '自驾自有私家车', '自驾自有摩托车/电动车', '火车', '大巴汽车', '飞机', '自驾', '打车', '公交', '地铁'],
        backTrafficInfo: '',
        showPickerBackDate: false,

        canWork: '',
        cannotReason: '',
        planWorkDate: '',
        showPickerCanWork: false,
        showPickerWorkDate: false,

        isLeaderContact: '',
        isLeaderContactCount: '',
        isLeaderContactLastDate: '',
        showPickerIsLeaderContact: false,
        showPickerLastContactDate: false,


        isKnowRule: '',
        isKnowRules: ['不清楚', '秘书通知', '领导通知', '官微', '同事转发', '其他'],
        showPickerIsKnowRule: false,

        question: '',

        jiguan: '',  // 出生籍贯
        jiguan1: '', // 父亲籍贯
        jiguan2: '', // 父亲工作地
        jiguan3: '', // 父亲居住地
        jiguan4: '', // 子女籍贯
        jiguan5: '', // 母亲工作地
        jiguan6: '', // 母亲居住地
        jiguan7: '', // 母亲籍贯
        showPickerJiguan: false,
        showPickerJiguan1: false,
        showPickerJiguan2: false,
        showPickerJiguan3: false,
        showPickerJiguan4: false,
        showPickerJiguan5: false,
        showPickerJiguan6: false,
        showPickerJiguan7: false,

        showPickerJiguanPo: false,
        dacityindex: null,

        fatherName: '', // 父亲姓名
        fatherAge: '', // 父亲年龄
        fatherAddress: '', // 父亲居籍贯
        fatherWorkPlace: '', // 父亲工作地
        fatherLivePlace: '', // 父亲居住地
        fatherTel: '',  // 父亲电话


        isFRetire: null, // 父亲是否退休
        showPickerisFRetire: false,


        motherName: '', // 母亲姓名
        motherAge: '', // 母亲年龄
        motherAddress: '', // 母亲地址
        motherWorkPlace: '', // 母亲工作地
        motherLivePlace: '', // 母亲居住地
        motherTel: '', // 母亲电话


        isMRetire: null, //母亲是否退休
        showPickerisMRetire: false,

        sfatherName: '', // 配偶父亲姓名
        sfatherAge: '', // 配偶父亲年龄
        sfatherAddress: '', // 配偶父亲居籍贯
        sfatherWorkPlace: '', // 配偶父亲工作地
        sfatherLivePlace: '', // 配偶父亲居住地
        sfatherTel: '',  // 配偶父亲电话
        sisFRetire: null, // 配偶父亲是否退休
        showPickersFather: false,
        sjiguan1: '',
        showPickersJiguan1: false,
        sjiguan2: '',
        showPickersJiguan2: false,
        sjiguan3: '',
        showPickersJiguan3: false,
        sisFRetire: '',
        showPickersisFRetire: false,

        smotherName: '', // 配偶母亲姓名
        smotherAge: '', // 配偶母亲年龄
        smotherAddress: '', // 配偶母亲地址
        smotherWorkPlace: '', // 配偶母亲工作地
        smotherLivePlace: '', // 配偶母亲居住地
        smotherTel: '', // 配偶母亲电话
        sisMRetire: null, //配偶母亲是否退休
        showPickersMother: false,
        sjiguan7: '',
        showPickersJiguan7: false,
        showPickersJiguan5: false,
        sjiguan6: '',
        showPickersJiguan6: false,
        sisMRetire: '',
        showPickersisMRetire: false,

        spouseName: '', // 配偶姓名
        spouseAge: '', // 配偶年龄
        spouseNative: '', // 配偶籍贯
        spouseAddress: '', // 配偶身份证地址
        spouseWork: '', // 配偶工作情况
        spouseworkCompany: '', // 配偶工作公司名称
        spouseworkAddress: '', // 配偶工作地址
        Worksituation: ['上班', '居家', '退休', '务农'],
        showPickerspouseNative: false,
        showPickerspouseWork: false,
        showPickerspouseworkA: false,


        jiguan: '',
        showPickerJiguan: false,
        citys: {
          '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
          '福建': ['福州', '厦门', '莆田', '三明', '泉州']
        },
        pcs: '',

        fatherName: '',
        fatherAge: '',
        fatherAddress: '',
        fatherWorkPlace: '',
        fatherLivePlace: '',
        fatherTel: '',

        motherName: '',
        motherAge: '',
        motherAddress: '',
        motherWorkPlace: '',
        motherLivePlace: '',
        motherTel: '',

        zinv: '',
        showPickerZiNv: false,
        showPickerZiNvBirth: false,
        showPickerZiNvStatus: false,
        zinvStatus: ['上学', '幼儿未上学', '上班', '待业'],
        zinvs: ['有', '无'],
        isShowZiNv: false,
        zinvindex: null,

        workLive: '',
        showPickerWorkLive: false,
        workLives: ['自有住房', '租赁住房', '集体宿舍', '羊台苑', '光谷苑', '张生楼'],

        isYiQu: '',
        showPickerIsYiQu: false,
        showPickerIsInfect: false,
        isYiQus: ['是', '否'],

        showPickerHealth: false,
        showPickerdHealthFamily: false,
        healthes: ['正常', '异常'],
        heal: ['正常', '被政府或医院确诊的病例，被政府认定为疑似的病例', '同时出现发热、乏力、干咳、呼吸困难等症状的，或者只是干咳、呼吸困 难、乏力等症状的', '有发热异常的，但无干咳、呼吸困难等症状的'],

        workLiveAddress: '',
        leadName: '',
        leadTel: '',

        workTraffic: '',
        showPickerWorkTraffic: false,
        workTraffics: ['自驾自有私家车', '自驾自有摩托车/电动车', '骑行自行车', '步行', '公司班车', '公交车', '地铁', '滴滴'],
        workTrafficInfo: '',
        workTrafficHolder: '',

        liveType: '',
        showPickerLiveType: false,

        showPickerstorkDynamic: false,
        liveTypes: ['自有住房', '租赁房', '酒店', '亲朋好友家', '娱乐场所', '公司公寓', '自驾车上', '巴士', '高铁', '火车', '飞机', '地铁', '餐馆', '其它'],

        isOut: '',
        showPickerIsOut: false,
        isOuts: ['是', '否'],

        juHui: '',
        showPickerJuHui: false,
        showPickerdAreaStatus: false,
        juHuis: ['未参加', '参加了10人以上聚会', '参加小于10人的聚会'],
        dAreaStatu: ['无', '有确诊感染病例', '经政府认定的疑似感染病例'],

        activeNames: '',

        showPickerdPartyType: false,
        dPartyTypes: ['家庭聚会', '同学聚会', '婚宴', '丧宴', '朋友聚会', '同事聚会'],

        currentDate: new Date(),
        minDate: new Date(1980, 0, 1),
        maxDate: new Date(2020, 3, 1),


        showPickerOutPlace: false,
        showPickerdOutTraffic: false,

        showPickerdWearMask: false,
        showPickerdHighPlace: false,
        dHighPlaces: ['否', '到过人员聚集场所（医院、火车站、汽车站、电影院、商场、超市 等）', '乘坐过地铁、公交等公共交通系统的', '参加过群体活动（聚餐、庙会、酒宴等）', '住过酒店，或在澡堂、浴场等场所活动过的', '在人员众较多的餐厅（10人以上）用过餐'],
        outPlace: ['火车站', '汽车站', '公司', '医院', '电影院', '商场', '超市', '酒店', '浴场', '澡堂', '其他'],
        attachHighs: ['否', '接触了确诊疫情人员', '接触了疑似病例人员', '接触了身体发热咳嗽人员', '不清楚'],

        showPickerDarea: false,
        showPickerdIsolate: false,
        showPickerdAttachHigh: false,
        showPickerdAttach: false,
        showPickerdCarBorrow: false,
        showPickerdSleepTogather: false,
        showPickerdHomeFriend: false,
        showPickerdAttachHow: false,
        showPickerdEat: false,
        dAttachs: ['无', '不清楚', '有'],
        dAttachHows: ['无确诊病例', '无疑似病例', '有确诊病例', '有疑似病例', '有身体异常人员（异常状况：发热、干咳）'],
        dHomeFriend: ['无', '有'],
        dCarBorrows: ['借出', '未借出', '不适用'],
        dEats: ['居家自己单独用餐', '公司集体食堂用餐', '外部用餐'],
        dSleepTogather: ['独居', '公司集体宿舍', '家人', '合租'],

        dailys: [],
        defaultDailys: [],

        copyshow: false,
        copyselIndex: null,
        copyminDate: new Date(2020, 0, 19),
        copyselDate: '',

        //每天的行程表单数组
        // dailys: [{
        //   dDate: '2020-01-18',
        //   dAddress: '',
        //   dAddressType: '',
        //   dPaintCount: '',
        //   dHealth: '',
        //   dTemplete: '',
        //   dIsOut: '',
        //   dOutReason: '',
        //   dOutPlace: '',
        //   dOutTraffic: '',
        //   dParty: '',
        //   dAttach: '',
        //   dCarBorrow: '',
        //   dAttachHigh: '',
        //   dSleepTogather: '',
        //   dHomeFriend: '',
        //   dAttachHow: '',
        //   dEat: '',
        // }, {dDate: '2020-01-19'}, {dDate: '2020-01-20'}, {dDate: '2020-01-21'}],

        areaList: areaListObj,

        tit: '疫情期间公司员工及来访人员行程动态调查      '

      }
    },
    methods: {
      submitBaseDataNoToast() {

        var v2 = '';
        var v3 = '';
        var v4 = '';
        var v5 = '';
        var v6 = '';
        for (var k in this.childrens) {
          v2 += this.childrens[k].name1 + ','
          v3 += this.childrens[k].name2 + ','
          v4 += this.childrens[k].name3 + ','
          v5 += this.childrens[k].name4 + ','
          v6 += this.childrens[k].name5 + ','
        }

        var params = {
          userno: this.userNo,
          uname: this.uname,
          dept1: this.dept1,
          dept2: this.dept2,
          tel: this.tel,
          gzdd: this.workPlace,
          nlsheng: this.nlsheng,
          nlshi: this.nlshi,
          idcarddz: this.idAddress,
          info1: this.hunYin,
          info1g1: this.poName,
          info1g2: this.poAddress,
          info1g3: this.poTel,
          info2: this.fatherState,
          info2g1: this.fatherName,
          info2g2: this.fatherAge,
          info2g3: this.jiguan1,
          info2g4: this.jiguan2,
          info2g5: this.jiguan3,
          info2g6: this.fatherTel,
          info3: this.motherState,
          info3g1: this.motherName,
          info3g2: this.motherAge,
          info3g3: this.jiguan7,
          info3g4: this.jiguan5,
          info3g5: this.jiguan6,
          info3g6: this.motherTel,
          info4: this.zinv,
          info4g1: JSON.stringify(this.childrens),
          info4g2: v2,
          info4g3: v3,
          info4g4: v4,
          info4g5: v5,
          info4g6: v6,
          info5: this.workLive,
          info1g1: this.workLiveCity,
          info5g1: this.workLiveAddress,
          leadName: this.leadName,
          leadTel: this.leadTel,
          info6: this.workTraffic,
          info6g1: this.workTrafficInfo,

          // kz1: this.kz1,
          // kz2: this.kz2,
          // kz3: this.kz3,

          isBack: this.isBack,
          backDate: this.backDate,
          backTraffic: this.backTraffic,
          backTrafficInfo: this.backTrafficInfo,

          canWork: this.canWork,
          cannotReason: this.cannotReason,
          planWorkDate: this.planWorkDate,

          isKnowRule: this.isKnowRule,

          isLeaderContact: this.isLeaderContact,
          isLeaderContactCount: this.isLeaderContactCount,
          isLeaderContactLastDate: this.isLeaderContactLastDate,

          question: this.question,

          personType: this.personType,
          personCompany: this.personCompany,
          personIDCard: this.personIDCard,
          personComeReason: this.personComeReason,
          personKz: this.personKz,
          personLearn: this.personLearn,


          isFRetire: this.isFRetire,
          isMRetire: this.isMRetire,
          spouseName: this.spouseName,
          spouseAge: this.spouseAge,
          spouseNative: this.spouseNative,
          spouseAddress: this.spouseAddress,
          spouseWork: this.spouseWork,
          spouseworkCompany: this.spouseworkCompany,
          spouseworkAddress: this.spouseworkAddress,
          sfatherName: this.sfatherName,
          sfatherAge: this.sfatherAge,
          // as
          sfatherState: this.sfatherState,
          sjiguan1: this.sjiguan1,
          sjiguan2: this.sjiguan2,
          sjiguan3: this.sjiguan3,
          smotherState: this.smotherState,
          sjiguan7: this.sjiguan7,
          sjiguan6: this.sjiguan6,
          // ad
          sfatherAddress: this.sfatherAddress,
          sfatherWorkPlace: this.sfatherWorkPlace,
          sfatherLivePlace: this.sfatherLivePlace,
          sfatherTel: this.sfatherTel,
          sisFRetire: this.sisFRetire,
          smotherName: this.smotherName,
          smotherAge: this.smotherAge,
          smotherAddress: this.smotherAddress,
          smotherWorkPlace: this.smotherWorkPlace,
          smotherLivePlace: this.smotherLivePlace,
          smotherTel: this.smotherTel,
          sisMRetire: this.sisMRetire,

          jsonVal: JSON.stringify(this.dailys)
        };

        this.$axios.post('http://appinter.sunwoda.com/wenjuan/inserInfo.json', params,
          // {headers: {
          //   'Content-Type': 'application/x-www-form-urlencoded',
          // },}
        ).then((response) => {
          // 在成功的回调里，从 response.data 获取返回数据
          if (response.data.statusCode == 0) {
            // Toast.success(response.data.message);
          } else {
            // Toast.fail(response.data.message);
          }
        })
      },
      // as
      infoChange(activeNames) {
        if (activeNames !== 'info' && activeNames !== '') {
          if (this.userNo === '' || this.idcard === '' || this.uname === '') {
            Toast('请先填写基本信息')
          }
        }
      },
      activeChange(activeNames) {
        if (activeNames !== '') {
          if (this.userNo === '' || this.idcard === '' || this.uname === '') {
            Toast('请先填写基本信息')
          }
        }
      },
      // ad
      copyCom() {
        // this.copyshow = true
        Dialog.alert({
          title: '提示',
          message: '为了节省大家填写时间：\n' + '1、如果此日期的行程信息与某一天已填写的行程信息一致可以选择已填写的行程日期进行快速复制；\n' + '2、如果只是类同也可复制后进行修改'
        }).then(() => {
          // on close
          this.copyshow = true
        });
      },
      copymaxdate(date) {
        var str = new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2])
        return str
      },
      onConfirmCopyDate(date) {
        var nowDate = date
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
          : nowDate.getMonth() + 1;
        var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
          .getDate();
        var dateStr = year + "-" + month + "-" + day;
        for (var i = 0; i < this.dailys.length; i++) {
          if (this.dailys[i].dDate === dateStr) {
            var obj = this.dailys[i]
            var that = this
            Object.keys(obj).forEach(function (key) {
              if (key !== 'dDate') {
                that.dailys[that.copyselIndex][key] = obj[key]
              }
            });
            that.copyshow = false
            return
          }
        }

        // this.dailys[this.copyselIndex].dDate = this.copyselDate
      },


      TitleScrolling() {
        setInterval(() => { //ES6箭头函数
          // 截取首字符串(第一个)
          var head = this.tit.substring(0, 1);
          // 截取除首字符串外所有字符串(除第一个所有)
          var foot = this.tit.substring(1);
          // 头尾拼接后赋给data => tit属性
          this.tit = foot + head;
          // 最后赋给最终显示的标题(标题)
          document.title = this.tit;
        }, 400)
      },

      confirmDateTime(index) {
        this.childrens[index].name4 = this.timeFormat(this.currentDate);
        this.showPickerZiNvBirth = false
      },

      confirmDateTimeDay(index) {
        this.backDate = this.timeFormatDay(this.currentDate);
        this.showPickerBackDate = false
      },
      confirmDateTimeWork(index) {
        this.planWorkDate = this.timeFormatDay(this.currentDate);
        this.showPickerWorkDate = false
      },
      confirmDateTimeLastContact(index) {
        this.isLeaderContactLastDate = this.timeFormatDay(this.currentDate);
        this.showPickerLastContactDate = false
      },

      timeFormatDay(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        return year + '-' + month + '-' + day
      },
      timeFormat(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        return year + '年' + month + '月'
      },

      addChildren() {
        var childen = {
          name1: '', name2: '', name3: '', name4: '', name5: '',
        };
        this.childrens.push(childen);
      },
      delChildren() {
        if (this.childrens.length > 1) this.childrens.pop();
      },
      onConfirmWorkPlace(value) {
        if (value == '驻外')
          this.isShowZhuWai = true;
        else {
          this.isShowZhuWai = false;
        }
        this.workPlace = value;
        this.showPickerWorkPlace = false;
      },
      onConfirmJiguan(value) {
        this.jiguan = value[0].name + value[1].name;
        this.nlsheng = value[0].name
        this.nlshi = value[1].name
        this.showPickerJiguan = false;
      },
      onConfirmJiguan1(value) {
        this.jiguan1 = value[0].name + value[1].name;
        this.showPickerJiguan1 = false;
      },
      onConfirmsJiguan1(value) {
        this.sjiguan1 = value[0].name + value[1].name;
        this.showPickersJiguan1 = false;
      },
      onConfirmJiguan2(value) {
        this.jiguan2 = value[0].name + value[1].name;
        this.showPickerJiguan2 = false;
      },
      onConfirmsJiguan2(value) {
        this.sjiguan2 = value[0].name + value[1].name;
        this.showPickersJiguan2 = false;
      },

      onConfirmspouseworkA(value) {
        this.spouseworkAddress = value[0].name + value[1].name + value[2].name;
        this.showPickerspouseworkA = false;
      },

      onConfirmJiguan3(value) {
        this.jiguan3 = value[0].name + value[1].name;
        this.showPickerJiguan3 = false;
      },
      onConfirmsJiguan3(value) {
        this.sjiguan3 = value[0].name + value[1].name;
        this.showPickersJiguan3 = false;
      },
      onConfirmJiguan4(value) {
        this.jiguan4 = value[0].name + value[1].name;
        this.showPickerJiguan4 = false;
      },
      onConfirmJiguan5(value) {
        this.jiguan5 = value[0].name + value[1].name;
        this.showPickerJiguan5 = false;
      },
      onConfirmsJiguan5(value) {
        this.sjiguan5 = value[0].name + value[1].name;
        this.showPickersJiguan5 = false;
      },
      onConfirmJiguan6(value) {
        this.jiguan6 = value[0].name + value[1].name;
        this.showPickerJiguan6 = false;
      },
      onConfirmsJiguan6(value) {
        this.sjiguan6 = value[0].name + value[1].name;
        this.showPickersJiguan6 = false;
      },
      onConfirmJiguan7(value) {
        this.jiguan7 = value[0].name + value[1].name;
        this.showPickerJiguan7 = false;
      },
      onConfirmsJiguan7(value) {
        this.sjiguan7 = value[0].name + value[1].name;
        this.showPickersJiguan7 = false;
      },
      onConfirmJiguan8(value) {
        this.jiguan8 = value[0].name + value[1].name;
        this.showPickerJiguan8 = false;
      },
      onConfirmspouseNative(value) {
        this.spouseNative = value[0].name + value[1].name;
        this.showPickerspouseNative = false;
      },
      onConfirmFather(value) {
        this.fatherState = value
        this.showPickerFather = false;
      },

      onConfirmsFather(value) {
        this.sfatherState = value
        this.showPickersFather = false;
      },
      onConfirmsMother(value) {
        this.smotherState = value
        this.showPickersMother = false;
      },

      onConfirmMother(value) {
        this.motherState = value
        this.showPickerMother = false;
      },

      onConfirmsMother(value) {
        this.smotherState = value
        this.showPickersMother = false;
      },
      onConfirmJiguanPo(value) {
        this.poAddress = value[0].name + value[1].name;
        this.showPickerJiguanPo = false;
      },
      onConfirmdacity(value) {
        this.dailys[this.dacityindex].dacity = value[0].name + value[1].name + value[2].name;
        this.dailys[this.dacityindex].dwell1 = value[0].name
        this.dailys[this.dacityindex].dwell2 = value[1].name
        this.dailys[this.dacityindex].dwell3 = value[2].name;
        this.showPickerdacity = false;
      },
      onConfirmworkLiveCity(value) {
        this.workLiveCity = value[0].name + value[1].name + value[2].name;
        this.showPickerworkLiveCity = false;
      },
      onChangeJiguan(picker, values) {
        // picker.setColumnValues(1, this.citys[values[0]]);
      },
      onConfirmZinv(value) {
        this.zinv = value;
        this.showPickerZiNv = false;
        if (value == '有')
          this.isShowZiNv = true;
        else
          this.isShowZiNv = false
      },
      onConfirmHunYin(value) {
        if (value == '已婚')
          this.isShowYiHun = true;
        else {
          this.isShowYiHun = false;
        }
        this.hunYin = value;
        this.showPickerHunYin = false;
      },
      onConfirmWorkLive(value) {

        this.workLive = value;
        this.showPickerWorkLive = false;
      },
      onConfirmWorkTraffic(value) {
        this.workTraffic = value;
        this.showPickerWorkTraffic = false;
        switch (value) {
          case '自驾自有私家车':
            this.workTrafficHolder = '请输入车牌号码'
            break;
          case '公司班车':
            this.workTrafficHolder = '请输入公司班车路线和上车站点'
            break;
          case '公交车':
            this.workTrafficHolder = '请输入主要公交路线，上车站点换乘站点和下车站点'
            break;

        }
      },
      onConfirmLiveType(value) {
        this.dailys[this.activeNames].dAddressType = value;
        this.showPickerLiveType = false;
      },
      onConfirmIsOut(value) {
        this.dailys[this.activeNames].dIsOut = value;
        this.showPickerIsOut = false;
      },
      onConfirmstorkDynamic(value) {
        this.dailys[this.activeNames].storkDynamic = value;
        this.showPickerstorkDynamic = false;
      },

      onConfirmDarea(value) {
        this.dailys[this.activeNames].dArea = value;
        this.showPickerDarea = false;
      },
      onConfirmdIsolate(value) {
        this.dailys[this.activeNames].dIsolate = value;
        this.showPickerdIsolate = false;
      },
      onConfirmOutPlace(value) {
        this.dailys[this.activeNames].dOutPlace = value;
        this.showPickerOutPlace = false;
      },
      onConfirmdAttachHigh(value) {
        this.dailys[this.activeNames].dAttachHigh = value;
        this.showPickerdAttachHigh = false;
      },
      onConfirmdSleepTogather(value) {
        this.dailys[this.activeNames].dSleepTogather = value;
        this.showPickerdSleepTogather = false;
      },
      onConfirmdHomeFriend(value) {
        this.dailys[this.activeNames].dHomeFriend = value;
        this.showPickerdHomeFriend = false;
      },
      onConfirmdAttachHow(value) {
        this.dailys[this.activeNames].dAttachHow = value;
        this.showPickerdAttachHow = false;
      },
      onConfirmdEat(value) {
        this.dailys[this.activeNames].dEat = value;
        this.showPickerdEat = false;
      },
      onConfirmdHighPlaces(value) {
        this.dailys[this.activeNames].dHighPlace = value;
        this.showPickerdHighPlace = false;
      },
      onConfirmdWearMask(value) {
        this.dailys[this.activeNames].dWearMask = value;
        this.showPickerdWearMask = false;
      },

      onConfirmOutTraffic(value) {
        this.dailys[this.activeNames].dOutTraffic = value;
        this.showPickerdOutTraffic = false;
      },
      onConfirmJuHui(value) {
        this.dailys[this.activeNames].dParty = value;
        this.showPickerJuHui = false;
      },
      onConfirmdPartyTypes(value) {
        this.dailys[this.activeNames].dPartyType = value;
        this.showPickerdPartyType = false;
      },
      onConfirmdAreaStatu(value) {
        this.dailys[this.activeNames].dAreaStatus = value;
        this.showPickerdAreaStatus = false;
      },

      onConfirmdAttach(value) {
        this.dailys[this.activeNames].dAttach = value;
        this.showPickerdAttach = false;
      },
      onConfirmdCarBorrow(value) {
        this.dailys[this.activeNames].dCarBorrow = value;
        this.showPickerdCarBorrow = false;
      },

      onConfirmIsYiQu(value) {
        this.dailys[this.activeNames].dIsYiQu = value;
        this.showPickerIsYiQu = false;
      },
      onConfirmIsInfect(value) {
        this.dailys[this.activeNames].dIsInfect = value;
        this.showPickerIsInfect = false;
      },
      onConfirmHealth(value) {
        this.dailys[this.activeNames].dHealth = value;
        this.showPickerHealth = false;
      },
      onConfirmdTemplete(value) {
        this.dailys[this.activeNames].dTemplete = value;
        this.showPickerdTemplete = false;
      },
      onConfirmdHealthFamily(value) {
        this.dailys[this.activeNames].dHealthFamily = value;
        this.showPickerdHealthFamily = false;
      },
      // end
      onConfirmIsBack(value) {
        this.isBack = value
        this.showPickerIsBack = false
      },

      onConfirmisFRetire(value) {
        this.isFRetire = value
        this.showPickerisFRetire = false
      },
      onConfirmsisFRetire(value) {
        this.sisFRetire = value
        this.showPickersisFRetire = false
      },
      onConfirmisMRetire(value) {
        this.isMRetire = value
        this.showPickerisMRetire = false
      },
      onConfirmsisMRetire(value) {
        this.sisMRetire = value
        this.showPickersisMRetire = false
      },
      onConfirmspouseWork(value) {
        this.spouseWork = value
        this.showPickerspouseWork = false
      },
      onConfirmCanWork(value) {
        this.canWork = value
        this.showPickerCanWork = false
      },
      onConfirmbackTraffics(value) {
        this.backTraffic = value
        this.showPickerbackTraffic = false
      },
      onConfirmbackTrafficInfos(value) {
        this.backTrafficInfo = value
        this.showPickerbackTrafficInfo = false
      },
      onConfirmzinvStatus(value) {
        this.childrens[this.zinvindex].name5 = value
        this.showPickerZiNvStatus = false
      },

      onConfirmIsLeaderContact(value) {
        this.isLeaderContact = value
        this.showPickerIsLeaderContact = false
      },
      onConfirmisLeaderContactCounts(value) {
        this.isLeaderContactCount = value
        this.showPickerisLeaderContactCount = false
      },

      onConfirmIsKnowRule(value) {
        this.isKnowRule = value
        this.showPickerIsKnowRule = false
      },

      onConfirmPersonType(value) {
        this.personType = value
        this.showPickerPersonType = false
      },
      onConfirmPersonKz(value) {
        this.personKz = value
        this.showPickerPersonKz = false
      },
      onConfirmPersonLearn(value) {
        this.personLearn = value
        this.showPickerPersonLearn = false
      },

      //定位获得当前位置信息
      getMyLocation() {
        var options = {timeout: 9000};
        var geolocation = new qq.maps.Geolocation("WLPBZ-7F4K6-NMZS2-EBQRD-6L7N3-IEBCO", "体温上报");
        // geolocation.getIpLocation(this.showPosition, this.showErr);
        geolocation.getLocation(this.showPosition, this.showErr, options);
        //geolocation.getLocation(this.showPosition, this.showErr);//或者用getLocation精确度比较高
      },
      showPosition(position) {
        console.log(position);
        this.position = position;
      },
      showErr() {
        console.log("定位失败");
        // Dialog.alert({
        //   title: '标题',
        //   message: '定位失败，请打开gps定位'
        // }).then(() => {
        //   // on close
        //   this.getMyLocation();
        // });
        this.getMyLocation();

      },
      
      getUserIn() {
        this.$axios.get('http://appinter.sunwoda.com/wenjuan/getUserInfo.json?token=' + this.userNo).then((response) => {
          // 在成功的回调里，从 response.data 获取返回数据
          if (response.data.statusCode == 0) {
            this.userNo = response.data.dataInfo.listData[0].userNo
            this.uname = response.data.dataInfo.listData[0].userName
            this.dept1 = response.data.dataInfo.listData[0].deptLevel1
            this.dept2 = response.data.dataInfo.listData[0].deptLevel3
            this.tel = response.data.dataInfo.listData[0].tel
            this.workPlace = response.data.dataInfo.listData[0].area
            this.usernoDs = true
          } else {
          }
        }).finally(() => {
          this.getUserBaseInfo();
        })
      },
      getToken() {
        this.$axios.get('http://appinter.sunwoda.com/weixin/cardFill/getUserInfo.json?token=' + this.$route.query.token).then((response) => {
          // 在成功的回调里，从 response.data 获取返回数据
          if (response.data.statusCode == 0) {
            this.userNo = response.data.dataInfo.listData[0].userNo
            this.uname = response.data.dataInfo.listData[0].userName
            this.dept1 = response.data.dataInfo.listData[0].deptLevel1
            this.dept2 = response.data.dataInfo.listData[0].deptLevel3
          } else {
          }
        }).finally(
          () => {
            this.getUserDayInfo();
            this.getMyLocation();
          }
        )
      },
      
      // 获取行程完善日期
      getUserDayInfo() {
        axios.get(`${API_GATEWAY}/question/getDateList`).then( res => {
          // 在成功的回调里，从 response.data 获取返回数据
          if (res.status == 200) {
            for (let i in res.data) {
              this.dailys.push({dDate: res.data[i]});
              this.defaultDailys.push({dDate: res.data[i]});
            }
          } else {

          }
        })
      },
      // 提交行程完善
      submitDaily() {
        var params = [];

        for (var d in this.dailys) {
          if (!this.dailys[d].dTemplete || !this.dailys[d].dAddressType || !this.dailys[d].dIsOut || !this.dailys[d].dParty || !this.dailys[d].dEat) {
            continue;
          }

          params.push({
            userno: this.userNo,
            uname: this.uname,
            dept1: this.dept1,
            dept2: this.dept2,
            seltime: this.dailys[d].dDate + " 00:00:00",
            // loc: this.position.province + this.position.city,
            dwell1: this.dailys[d].dwell1,
            dwell2: this.dailys[d].dwell2,
            dwell3: this.dailys[d].dwell3,
            dwell4: this.dailys[d].dAddress,

            disinfect: this.dailys[d].dIsInfect,
            darea: this.dailys[d].dArea,
            disolate: this.dailys[d].dIsolate,
            disolateday: this.dailys[d].disolateDay,


            redio1: this.dailys[d].dAddressType,
            redio2: this.dailys[d].dIsYiQu,
            redio2g: this.dailys[d].dPaintCount,
            redio3: this.dailys[d].dHealth,
            redio3g: this.dailys[d].dHealthWhy,
            redio4g: this.dailys[d].dTemplete,
            redio5: this.dailys[d].dIsOut,
            redio5g: this.dailys[d].dOutReason,
            redio5g1: this.dailys[d].dOutPlace,
            redio5g2: this.dailys[d].dOutTraffic,
            redio6: this.dailys[d].dParty,
            redio6g1: this.dailys[d].dPartyPlace,
            redio6g2: this.dailys[d].dPartyType,
            redio7: this.dailys[d].dAttach,
            redio8: this.dailys[d].dCarBorrow,
            redio9g: this.dailys[d].dAttachHigh,
            redio10: this.dailys[d].dSleepTogather,
            redio11: this.dailys[d].dHomeFriend,
            redio12: this.dailys[d].dAttachHow,
            redio13: this.dailys[d].dEat,

            redio7g: this.dailys[d].dAttDetail,
            redio8g: this.dailys[d].dCarDetail,
            redio10g: this.dailys[d].dSleepDetail,
            redio11g: this.dailys[d].dHomeFriendDetail,
            redio12g: this.dailys[d].dAttachHowDetail,
            redio13g: this.dailys[d].dEatDetail,
          })
        }
        axios.post(`${API_GATEWAY}/question/saveTripInfo`, params,
          {headers: {
            'X-TenantId': this.tenantId
          }}).then((res) => {
          // 在成功的回调里，从 response.data 获取返回数据
          
          if (res.data.code == 200) {
            Toast.success(resizeTo.data.message);
          } else {
            Toast.fail(res.data.message);
          }
        }).catch(err =>{
          console.log(err);
        })
      },
      // 提交 基本信息 放工情况 家庭情况
      submitBaseData() {

        var v2 = '';
        var v3 = '';
        var v4 = '';
        var v5 = '';
        var v6 = '';
        for (var k in this.childrens) {
          v2 += this.childrens[k].name1 + ','
          v3 += this.childrens[k].name2 + ','
          v4 += this.childrens[k].name3 + ','
          v5 += this.childrens[k].name4 + ','
          v6 += this.childrens[k].name5 + ','
        }

        var params = {
          userno: this.userNo,
          uname: this.uname,
          dept1: this.dept1,
          dept2: this.dept2,
          tel: this.tel,
          gzdd: this.workPlace,
          nlsheng: this.nlsheng,
          nlshi: this.nlshi,
          idcarddz: this.idAddress,
          info1: this.hunYin,
          info1g1: this.poName,
          info1g2: this.poAddress,
          info1g3: this.poTel,
          info2: this.fatherState,
          info2g1: this.fatherName,
          info2g2: this.fatherAge,
          info2g3: this.jiguan1,
          info2g4: this.jiguan2,
          info2g5: this.jiguan3,
          info2g6: this.fatherTel,
          info3: this.motherState,
          info3g1: this.motherName,
          info3g2: this.motherAge,
          info3g3: this.jiguan7,
          info3g4: this.jiguan5,
          info3g5: this.jiguan6,
          info3g6: this.motherTel,
          info4: this.zinv,
          info4g1: JSON.stringify(this.childrens),
          info4g2: v2,
          info4g3: v3,
          info4g4: v4,
          info4g5: v5,
          info4g6: v6,
          info5: this.workLive,
          info5g1: this.workLiveAddress,
          info6: this.workTraffic,
          info6g1: this.workTrafficInfo,

          kz1: this.kz1,
          kz2: this.kz2,
          kz3: this.kz3,

          isback: this.isBack,
          backdate: this.backDate,
          backtraffic: this.backTraffic,
          backtrafficinfo: this.backTrafficInfo,

          canwork: this.canWork,
          cannotreason: this.cannotReason,
          planworkdate: this.planWorkDate,

          isknowrule: this.isKnowRule,

          isleadercontact: this.isLeaderContact,
          isleadercontactcount: this.isLeaderContactCount,
          isleadercontactlastdate: this.isLeaderContactLastDate,

          question: this.question,

          persontype: this.personType,
          personcompany: this.personCompany,
          personidcard: this.personIDCard,
          personcomereason: this.personComeReason,
          personkz: this.personKz,
          personlearn: this.personLearn,


          isfretire: this.isFRetire,
          ismretire: this.isMRetire,
          spousename: this.spouseName,
          spouseage: this.spouseAge,
          spousenative: this.spouseNative,
          spouseaddress: this.spouseAddress,
          spousework: this.spouseWork,
          spouseworkcompany: this.spouseworkCompany,
          spouseworkaddress: this.spouseworkAddress,
          sfathername: this.sfatherName,
          sfatherage: this.sfatherAge,
          sfatheraddress: this.sfatherAddress,
          sfatherworkplace: this.sfatherWorkPlace,
          sfatherLiveplace: this.sfatherLivePlace,
          sfathertel: this.sfatherTel,
          sisfretire: this.sisFRetire,
          smothername: this.smotherName,
          smotherage: this.smotherAge,
          smotheraddress: this.smotherAddress,
          smotherworkplace: this.smotherWorkPlace,
          smotherLiveplace: this.smotherLivePlace,
          smothertel: this.smotherTel,
          sismretire: this.sisMRetire,

        };

        axios.post(`${API_GATEWAY}/question/saveBasicInfo`, params,
          {headers: {
            'X-TenantId': this.tenantId
          }}).then((res) => {
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
        if (!this.userNo || !this.uname || !this.dept1 || !this.dept2 || !this.tel || !this.workPlace) {
          Toast.fail('请将基本信息必填项填写完整');
          return;
        }

        this.submitBaseData();
        this.submitDaily();
      },
      // 获取基础信息
      getUserBaseInfo() {
        let _this = this;
        axios.get(`${API_GATEWAY}/question/getOriginInfo?workNo=${this.userNo}`,
          {headers: {
            'X-TenantId': this.tenantId
          }}).then(res => {
            if (res.status == 200 && !!res.data) {
              let data = res.data
              this.uname = data.uname
              this.dept1 = data.dept1
              this.dept2 = data.dept2
              this.tel = data.tel
              this.workPlace = data.gzdd
              this.idAddress = data.idcarddz
              this.hunYin = data.info1
              
              if (this.hunYin === '已婚') {
                this.isShowYiHun = true
              } else {
                this.isShowYiHun = false
              }

              this.poName = data.info1g1
              this.poAddress = data.info1g2
              this.poTel = data.info1g3
              this.fatherName = data.info2g1
              this.fatherAge = data.info2g2
              this.fatherState = data.info2 ? data.info2 : '健在'
              this.motherState = data.info3 ? data.info3 : '健在'
              if (data.nlsheng && data.nlshi) {
                this.jiguan = data.nlsheng + data.nlshi
              }

              this.jiguan1 = data.info2g3
              this.jiguan2 = data.info2g4
              this.jiguan3 = data.info2g5
              this.fatherTel = data.info2g6

              this.motherName = data.info3g1
              this.motherAge = data.info3g2
              this.jiguan7 = data.info3g3
              this.jiguan5 = data.info3g4
              this.jiguan6 = data.info3g5
              this.motherTel = data.info3g6
              this.zinv = data.info4
              this.isShowZiNv = this.zinv == '有' ? true : false

              this.childrens = JSON.parse(data.info4g1)

              this.workLive = data.info5
              this.workLiveAddress = data.info5g1
              this.workTraffic = data.info6
              this.workTrafficInfo = data.info6g1

              this.kz1 = data.kz1
              this.kz2 = data.kz2
              this.kz3 = data.kz3

              this.isBack = data.isback
              this.backDate = data.backdate
              this.backTraffic = data.backtraffic
              this.backTrafficInfo = data.backtrafficinfo

              this.canWork = data.canWork
              this.cannotReason = data.cannotreason
              this.planWorkDate = data.planWorkdate

              this.isKnowRule = data.isknowrule

              this.isLeaderContact = data.isleadercontact
              this.isLeaderContactCount = data.isleadercontactcount
              this.isLeaderContactLastDate = data.isleadercontactlastdate

              this.question = data.question

              // this.personType = data.persontype
              this.personCompany = data.personcompany
              this.personIDCard = data.personidcard
              this.personComeReason = data.personcomereason
              this.personKz = data.personkz
              this.personLearn = data.personlearn


              this.isFRetire = data.isfretire
              this.isMRetire = data.ismretire
              this.spouseName = data.spousename
              this.spouseNative = data.spousenative
              this.spouseAddress = data.spouseaddress
              this.spouseWork = data.spousework
              this.spouseworkCompany = data.spouseworkcompany
              this.spouseworkAddress = data.spouseworkaddress
              this.sfatherName = data.sfathername
              this.sfatherAge = data.sfatherage
              this.sfatherAddress = data.sfatheraddress
              this.sfatherWorkPlace = data.sfatherworkplace
              this.sfatherLivePlace = data.sfatherLiveplace
              this.sfatherTel = data.sfathertel
              this.sisFRetire = data.sisfretire
              this.smotherName = data.smothername
              this.smotherAge = data.smotherage
              this.smotherAddress = data.smotheraddress
              this.smotherWorkPlace = data.smotherworkplace
              this.smotherLivePlace = data.smotherLiveplace
              this.smotherTel = data.smothertel
              this.sisMRetire = data.sismretire

              //行程信息
              // this.dailys = JSON.parse(JSON.stringify(data.recentTripInfoList))
              _this.dailys = data.recentTripInfoList

              if (!_this.dailys || _this.dailys.length == 0) {
                _this.dailys = [{dDate: '2019-01-19'}]
              }
              var lastDay = _this.dailys[0].dDatedDate
              // var lastDay = _this.dailys[_this.dailys.length - 1].seltime.split(' ')[0];
              for (var i in _this.defaultDailys) {
                if (_this.defaultDailys[i].dDate != lastDay) {
                  if (lastDay == '2019-01-19') {
                    _this.dailys.push({dDate: _this.defaultDailys[i].dDate})
                    if (i == _this.defaultDailys.length - 1) {
                      _this.dailys.shift()
                    }
                  } else {

                    var temp = []
                    temp.push({dDate: _this.defaultDailys[i].dDate})

                    _this.dailys.unshift(temp)
                  }
                } else {
                  break;
                }
              }
            } else {

            }
        })
      },
    },
    mounted() {
      this.TitleScrolling()
      // end
      Dialog.alert({
        title: '尊敬的各位欣家人：新年好！',
        message: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp随着武汉新型冠状病毒肺炎疫情的爆发蔓延，牵动着每一位中国人的心，为尽快尽早彻底打赢这场防控疫情的战争' +
          '争取早日复工复学，让社会秩序一切恢复正常。' +
          '公司设置本调查问卷，请大家务必真实详尽的填写，这将是对我们最大的支持和帮助，非常感谢！\n <h5>【公司会对信息进行严格保密，请大家放心填写】</h5>'
      }).then(() => {
        // on close
      });
      // this.getToken();
      this.tenantId = this.$route.query.tenantId || JSON.parse(window.localStorage.getItem('user')).tenantId;
      this.getUserDayInfo();
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

