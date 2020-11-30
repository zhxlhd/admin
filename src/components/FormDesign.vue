<template>
  <el-row>
    <el-col :span="8">
      <template>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="添加新字段" name="first">
            <el-row>
              <el-col :span="8" v-for="(field, index) in fields" :offset="2" :key="index">
              <div @click="newField(field)" class="active-item">
                <el-card :body-style="{ padding: '0px' }">
                    <div class="card-item">
                      <span>{{ field.type }}</span>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="编辑字段" name="second">
            <el-form ref="form" :model="form">
              <el-form-item>
                <p>表单名称: {{ field.name }}</p>
                <p>字段类型: {{ field.type }}</p>
              </el-form-item>
              <label>Label</label><hr>
              <el-form-item label="字段名称">
                <el-input v-model="field.name"></el-input>
                <el-input type="textarea" :row="2" placeholder="字段描述" v-model="field.message"></el-input>
                <el-checkbox label="是否必需" v-model="field.required"></el-checkbox>
              </el-form-item>
              <label>Options</label><hr>
              <el-form-item v-for="(option, index) in options" :key="index">
                <el-col :span="14">
                  <el-input v-model="option.label"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-button size="mini" @click="addOption">+</el-button>
                  <el-button size="mini" @click="removeOption(index)">-</el-button>
                </el-col>
              </el-form-item>
              <label>Size</label><hr>
              <el-form-item>
                <el-select clearable v-model="form.region">
                  <el-option label="Small" value="0"></el-option>
                  <el-option label="Medium" value="1"></el-option>
                  <el-option label="Large" value="2"></el-option>
                </el-select>
              </el-form-item>
              <label>Length Limit</label><hr>
              <el-form-item>
                <el-col :span="11">
                  <label class="line">Min</label>
                  <el-input></el-input>
                </el-col>
                <el-col :span="11">
                  <label class="line">Max</label>
                  <el-input></el-input>
                </el-col>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-col>
    <el-col :span="16">
      <el-row type="flex" justify="end">
        <el-col :span="3">
          <el-button>保存</el-button>
        </el-col>
      </el-row>
      <draggable v-model="myArray">
        <transition-group>
            <div v-for="(element, index) in myArray" :key="element.id" class="drag-item" :class="{ 'field-edit': field.id == element.id}" @click="editField(element)">
              <el-col :span="16">
                <label :class="{ content: field.required == true && field.id == element.id }">字段类型-{{ element.type }}</label><br>
                <el-input></el-input><br>
                <label>{{ element.message }}</label>
                <div class="actions-wrapper">
                  <el-button size="mini" @click="addField(index)">+</el-button>
                  <el-button size="mini" @click="removeField(index)">-</el-button>
                </div>
              </el-col>
            </div>
        </transition-group>
      </draggable>
    </el-col>
  </el-row>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data () {
    return {
      form: {},
      field: {
        id: 1,
        type: '文本',
        name: '用户名',
        required: false,
        message: '字段描述'
      },
      activeName: 'first',
      myArray: [
        { "id":"1", "name": "a", "order": 1, "holder": "date", type: "日期", "fixed": false },
        { "id":"2", "name": "b", "order": 2, "holder": "password", type: "密码",  "fixed": false },
        { "id":"3", "name": "c", "order": 3, "holder": "radio", type: "数字",  "fixed": false }
      ],
      options: [
        { "label": "选项1","value": 0 },
        { "label": "选项2","value": 1 }
      ],
      // fields: [ "文本", "密码", "E-mail", "单选", "多选", "下拉", "多行文本", "日期", "数字", "隐藏" ],
      fields: [
        { "holder": "text", "type": "文本" },
        { "holder": "password", "type": "密码" },
        { "holder": "text", "type": "E-mail" },
        { "holder": "switch", "type": "开关", "on": "on", "off": "off" },
        { "holder": "radio", "type": "单选", "options": { "on": "on", "off": "off"} },
        { "holder": "checkbox", "type": "多选", "options": [] },
        { "holder": "select", "type": "下拉" },
        { "holder": "textarea", "type": "多行文本", "options": { "label": "on", "value": "off"} },
        { "holder": "date", "type": "日期" },
        { "holder": "number", "type": "数字" },
        { "holder": "text", "type": "隐藏" },
      ]
    }
  },
  methods: {
    newField (field) {
      this.activeName = 'second'
      let newItem = {};
      newItem = field;
      newItem.id = 'New Field' + (parseInt(this.myArray.length) + 1)
      this.myArray.push(newItem)
    },
    handleClick () {
      //this.activeName = 'first'
    },
    addField (index) {
      this.activeName = 'second'
      let current = this.myArray[index]
      let newItem = Object.assign({}, current);
      newItem.id = 'New Field' + (parseInt(this.myArray.length) + 1)
      this.myArray.push(newItem)
    },
    removeField (index) {
      this.myArray.splice(index, 1)
    },
    addOption (id) {
      let idx = this.options.length + 1;
      let newOption = { "label": "选项" + idx,"value": idx }
      this.options.push(newOption)
    },
    removeOption (index) {
      this.options.splice(index, 1)
    },
    editField (element) {
      this.field = element
      this.activeName = 'second'
    }
  }
}
</script>
<style scoped>
 .drag-item {
   position: relative;
   height: 100px;
   margin: 10px 10px 20px 20px;
 }
 .field-edit {
   background: #d9e1e3;
 }
 .drag-item:hover{
  border: 1px dashed #000;
 }
 .card-item {
  height:40px;
  text-align:center;
  line-height: 40px;
 }
 .el-card{
   margin-bottom: 10px;
 }
 .active-item:hover{
   cursor: pointer;
 }
 .input-size {
   width: 400px;
 }
 .el-form-item{
  width: 100%;
 }
 .actions-wrapper {
   position: absolute;
   right: 5px;
   bottom: -10px;
   z-index: 3;
 }
 .content::after {
   content: '*';
   color: red;
 }
 .el-form-item {
    margin: 15px 20px 2px 0px;
}
</style>