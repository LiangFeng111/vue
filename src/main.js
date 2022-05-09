import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/global.css'
// 导入所有的el-icon图标
import * as ElIconModules from '@element-plus/icons-vue'
//中文
import locale from 'element-plus/es/locale/lang/zh-cn'
//动态拦截器配置
import '@/utils/request'
//全局拦截配置
import request from '@/router/index'
// 这里就可以进行vue-router的beforeEach拦截了
request.beforeEach((to, from, next) =>{
    //取出sessionStorage里面的缓存信息
    let userJson=sessionStorage.getItem("user")
    // 这里必须加上to.path !== 'login'的判断，不然会陷入无限循环，
    // 因为逻辑是第一次进来，判断用户信息不存在，即!user为true，由于使用的是next('/login')而非next()，
    // 会再次进入路由跳转，next()方法没有参数是直接进入页面，不会再次进入路由拦截，有参数则会，因为跳转，
    // 所以再次进入路由，再次判断，再次进入路由，再次判断，循环往复无限循环
    // 所以一定要加to.path !== 'login'的判断
    if (!userJson && to.path !== '/login' && to.path !== '/register'){
        next('/login')
    }else {
        next()
    }
})


const app=createApp(App)
    app.use(store)
    app.use(request)
    app.use(router)
    app.use(ElementPlus,{locale, size:'small'})
for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}
    app.mount('#app')
//  统一注册el-icon图标

