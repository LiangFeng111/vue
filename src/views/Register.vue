<template>
  <div style="width: 100%; height: 100vh; background-color: #0680a7 ;  overflow: hidden ;">
    <div class="loginPart">
      <div style="color: #ffffff ; font-size: 30px; text-align: center ; padding: 10px">用户注册</div>
      <div style="width: 200px;margin: 0 auto">
        <el-form ref="formRef"
                 :rules="rules"
                 :model="form"
                 label-width="auto">
          <el-form-item prop="username">
            <el-input v-model="form.username">
              <template #prefix>
                <el-icon>
                  <user-filled/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" show-password>
              <template #prefix>
                <el-icon>
                  <lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirm">
            <el-input v-model="form.confirm" show-password>
              <template #prefix>
                <el-icon>
                  <lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="register('formRef')"
                       style="width: 40% ;margin-left: 15px">注册
            </el-button>
            <el-button type="primary"
                       @click="reactive('formRef')"
                       style="width: 40% ;margin-left: 15px">重置
            </el-button>

          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: right;color: white;">
        <el-link @click="$router.push('/login')" type="warning">去登录</el-link>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "Login",
  components() {
  },
  data() {
    return {
      form: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名！', trigger: 'blur'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码！', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
        confirm: [
          {required: true, message: '请输入二次密码！', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    register(formRef) {
      if (this.form.password !== this.form.confirm) {
        this.message("2次密码输入不一致！", 'error')
        return
      }
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          request.post("user/register", this.form).then(res => {
            if (res.code === '0') {
              this.message("注册成功", 'success')
              this.$router.push("/login")//登录跳转到主页
            } else {
              this.message(res.msg, 'error')
            }
          })
        }
      })
    },
    reactive(formRef) {//重置
      this.$refs[formRef].resetFields();
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
.loginPart { /* 用户登录div里面包含的盒子设置 */
  position: absolute;
  /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%;
  /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, -50%);
  /*实现块元素百分比下居中*/
  width: 450px;
  padding: 50px;
  background: rgba(0, 0, 0, .5);
  /*背景颜色为黑色，透明度为0.8*/
  box-sizing: border-box;
  /*box-sizing设置盒子模型的解析模式为怪异盒模型，
  将border和padding划归到width范围内*/
  box-shadow: 0px 15px 25px rgba(0, 0, 0, .5);
  /*边框阴影  水平阴影0 垂直阴影15px 模糊25px 颜色黑色透明度0.5*/
  border-radius: 15px;
  /*边框圆角，四个角均为15px*/
}
</style>