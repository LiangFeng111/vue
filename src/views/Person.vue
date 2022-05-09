<template>
  <div>
    <el-card style="width: 40%; margin: 10px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled/>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.sex" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" show-password />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="update">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "Person",
  data() {
    return {
      form: {}
    }
  },
  created() {//页面加载调用
    let str = sessionStorage.getItem("user") || "{}"
    this.form =JSON.parse(str)
  },
  methods: {
    update() {
      request.put("/user", this.form).then(res => {
        if (res.code === '0') {
          this.message("更新成功！","success")
          sessionStorage.setItem("user",JSON.stringify(this.form))
        }else {
          this.message(res.msg,"error")
        }
      })
    },
    //提示信息
    message(msg, type) {
      ElMessage({
        showClose: true,
        message: msg,
        type: type,
        center: true,
      })
    },
  }
}
</script>

<style scoped>

</style>