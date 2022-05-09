<template>
  <div >
    <el-menu style="width: 150px;height:  calc(100vh - 50px)"
             router
             :default-active="path"
             class="el-menu-vertical-demo">
      <el-sub-menu  style="width: 150px" >
        <template #title>
          <el-icon>
            <location/>
          </el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item-group  title="选项">
          <el-menu-item index="user" >用户管理</el-menu-item>
          <el-menu-item index="person">订单管理</el-menu-item>
          <el-menu-item index="news">新闻管理</el-menu-item>
          <el-menu-item index="category">分类管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "Aside",
  data(){
    return{
      user:{},
      path:this.$route.path
    }
  },
  created() {
    let userStr = sessionStorage.getItem("user") || "{}"
    this.user = JSON.parse(userStr)

    request.get("/user/"+this.user.id).then(res=>{
      if (res.code ==='0'){
        this.user = res.data
      }
    })

  }
}

</script>

<style scoped>

</style>