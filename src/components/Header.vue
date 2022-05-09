<template>
  <div id="app">
    <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #aaaeaa ;display: flex">
      <div style="width: 200px ;padding-left: 30px; font-weight: bold; color: #00cdff">后台管理</div>
      <div style="flex: 1"></div>
      <div style="width: 100px;text-align: center;margin-right: 20px">
        <el-image
            style="width: 30px; height: 30px ;margin-top: 10px; margin-right: 1px; border-radius: 30px;"
            :src="user.headImg"
            :preview-src-list="[user.headImg]"
            :initial-index="4"
            fit="cover"
            preview-teleported="true"
        />
        <el-dropdown style="line-height: 50px">

          {{user.nickName}}
        <span class="el-dropdown-link">
          <el-icon><arrow-down /></el-icon>
        </span>
          <template #dropdown>
            <el-dropdown-menu>

              <el-dropdown-item @click="$router.push('/person')">个人信息</el-dropdown-item>
              <el-dropdown-item @click="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name:"Header",
    data(){
      return{
        user:"",
      }
    },
    created() {
      let u =JSON.parse(sessionStorage.getItem("user"))
      if (u!=null){
        this.user=u
        console.log(u.headImg)
      }
    },
    methods:{
      exit(){
        sessionStorage.removeItem("user")
        this.$router.push("/login")
      }
    }
  }
</script>

<style scoped>

</style>