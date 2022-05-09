<template>
  <div style="width: 100%; height: 100vh; background-color: #0680a7 ; overflow: hidden">
    <div class="loginPart">
      <div style="color: #ffffff ; font-size: 30px; text-align: center ; padding: 10px">用户登录</div>
      <div style="width: 250px;margin: 0 auto">
        <el-form :model="form"
                 :rules="rules"
                 ref="formRef"
                 label-width="auto">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入账号">
              <template #prefix>
                <el-icon>
                  <user-filled/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" show-password>
              <template #prefix>
                <el-icon>
                  <lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="validCode">
            <div style="display: flex">
              <el-input style="width: 50%; margin-right: 5px " v-model="form.validCode"  placeholder="请输入验证码">
                <template #prefix>
                  <el-icon>
                    <key/>
                  </el-icon>
                </template>
              </el-input>
              <ValidCode style="height: 30px; background-color: #b3eece" @input="createValidCode"/>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       v-model="form.type"
                       @click="login('formRef')"
                       style="width: 100%">登录
            </el-button>
          </el-form-item>

        </el-form>
      </div>
      <div style="text-align: right;color: white;">
        <el-link @click="$router.push('/register')" type="warning">没有账号？去注册</el-link>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

//验证码生成器
import  ValidCode   from "@/components/ValidCode";

export default {
  name: "Login",
  components:{
    ValidCode
  },
  data() {
    return {
      form: {},
      validCode:'',
      rules: {
        username: [
          {required: true, message: '请输入用户名！', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码！', trigger: 'blur'},
        ],
        validCode:[
          {required: true, message: '请输入验证码！', trigger: 'blur'},
        ]
      },
    }
  },
  methods: {
    login(formRef) {
      this.$refs[formRef].validate((valid) => {
          if (valid) {
            //判断表单的验证码和组件生成的验证码是否一致，toLowerCase修改为小写
            if (this.form.validCode.toLowerCase() !==this.validCode.toLowerCase()){
              this.message("验证码错误",'error')
              return
            }
            request.post("user/login", this.form).then(res => {
              if (res.code === '0') {
                this.message("登录成功", 'success')
                console.log(res)
                sessionStorage.setItem("user",JSON.stringify(res.data))
                this.$router.push("/")//登录跳转到主页
              } else {
                this.message(res.msg, 'error')
              }
            })
          }
      })


    },
    createValidCode(data){
      //接收验证码组件提交的 4位验证码
      this.validCode = data
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