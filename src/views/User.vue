<template>
  <div style="padding: 10px;width: calc(100vh - 50px)" >
    <!--    查询-->
    <div style="margin-bottom: 10px">
      <el-input v-model="input"
                placeholder="查询昵称"
                style="width: 200px"
                clearable/>
      <el-button type="primary" style="margin-left: 10px" @click="load">查询</el-button>
      <el-button type="primary" @click="add" style="margin-left: 10px">新增</el-button>
      <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="red"
          @confirm="deleteBatch"
          title="你确定要删除吗?">
        <template #reference>
          <el-button type="danger" >批量删除</el-button>
        </template>
      </el-popconfirm>
      <!--      对话框-->

      <el-dialog v-model="centerDialogVisible" :title="title" width="350px" center>
        <el-form :model="form" label-width="100px">
          <el-form-item label="用户名:">
            <el-input v-model="form.username" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="昵称:">
            <el-input v-model="form.nickName" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="头像:">
            <el-upload
                ref="upload"
                :on-success="filesUploadSuccess"
                action="http://localhost:9090/files/upload">
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="年龄:">
            <el-input v-model="form.age" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="性别:">
            <el-radio v-model="form.sex" label="男">男</el-radio>
            <el-radio v-model="form.sex" label="女">女</el-radio>
            <el-radio v-model="form.sex" label="未知">未知</el-radio>
          </el-form-item>
          <el-form-item label="地址:">
            <el-input v-model="form.address" type="textarea" style="width: 80%"/>
          </el-form-item >
          <el-form-item label="管理员:" >
            <el-radio v-model="form.role" :label='1'>管理员</el-radio>
            <el-radio v-model="form.role" :label="2">普通用户</el-radio>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button :plain="true" type="primary" @click="save">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!--    表格数据-->
    <div>
      <el-table
          :data="tableData"
          stripe
          border
          v-loading="loading"
          row-style="text-align: center"
          @selection-change="handleSelectionChange"
          style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" sortable/>
        <el-table-column  label="头像">
          <template #default="scope">
              <el-image
                  style="width: 30px; height: 30px;"
                  :src="scope.row.headImg"
                  :preview-src-list="[scope.row.headImg]"
                  :initial-index="4"
                  fit="cover"
                  preview-teleported="true"
              />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="nickName" label="昵称"/>

        <el-table-column prop="age" label="年龄"/>
        <el-table-column prop="sex" label="性别"/>
        <el-table-column prop="address" label="地址"/>
        <el-table-column label="角色:">
          <template #default="scope">
            <span v-if="scope.row.role ===1">管理员</span>
            <span v-if="scope.row.role ===2">普通用户</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)"
                  title="你确定要删除吗?">
                <template #reference>
                  <el-button type="danger" >删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>

      </el-table>
      <!--      分页-->
      <div style="margin: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next ,jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from 'element-plus'

const {InfoFilled} = require("@element-plus/icons-vue");
const right = require("@element-plus/icons-vue/dist/es/right.mjs");
export default {
  name: "Home",
  components() {
  },
  data() {
    return {
      form: {},
      centerDialogVisible: false,
      input: '',
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      title:"", //表单标题
      ids:{},
    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    //批量删除
    deleteBatch(){
      if (!this.ids.length){
        this.message("请选择数据",'error')
        return
      }
      request.post('/user/deleteBatch',this.ids).then(res=>{
        if (res.code === '0') {
          this.message("删除成功",'success')
          this.load()//刷新表格数据
        }else {
          this.message(res.msg,'error')
        }

      })

    },
    //全选
    handleSelectionChange(val){
      this.ids = val.map(v => v.id)  // map 的作用[{id,name},{id,name}] => [id,name]
    },
    //文件上传
    filesUploadSuccess(res){
      this.form.headImg = res.data
      console.log(res)
    },
    load() {
      request.get("/user", {
        params:{
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.input
        }
      }).then(res => {
        this.tableData=res.data.records
        this.total = res.data.total
      })
    },
    add() {
      this.title='新增用户'
      // 显示对话框
      this.centerDialogVisible = true
      //清空表单内容
      this.form = {}//表单元素创建之后加载
      this.$nextTick(()=>{
        this.$refs['upload'].clearFiles() //清除头像文件列表
      })
    },
    //提示信息
    message(msg,type){
      ElMessage({
        showClose: true,
        message: msg,
        type: type,
        center: true,
      })
    },
    save() {
      //如果form有id就返回ture，没有则反之
      if (this.form.id){//更新
        request.put("/user", this.form).then(res => {
          if (res.code === '0') {
            this.message("修改成功",'success')
          }else {
            this.message(res.msg,'error')
          }
          this.load()//刷新表格数据
          this.centerDialogVisible = false//关闭弹窗
        })
      }else {//新增
        request.post("/user/register", this.form).then(res => {
          if (res.code === '0') {
            this.message("添加成功！",'success')
            this.load()//刷新表格数据
            this.centerDialogVisible = false//关闭弹窗
          }else {
            this.message(res.msg,'error')
          }
        })
      }

    },
    handleSizeChange(val) { //改变当前每页的个数触发
      this.pageSize=val
      this.load()
    },
    handleCurrentChange(val) {//改变当前页码触发
      this.currentPage = val
      this.load();
    },
    handleEdit(row){
      //JSON.parse(JSON.stringify(row))表示成为独立对象
      this.title="修改用户信息"
      this.form = JSON.parse(JSON.stringify(row))
      this.centerDialogVisible=true
      //表单元素创建之后加载
      this.$nextTick(()=>{
        this.$refs['upload'].clearFiles() //清除头像文件列表
      })

    },
    handleDelete(id){
      request.delete("user/"+id).then(res=>{
        if (res.code === '0') {
          this.message("删除成功！",'success')
        }else {
          this.message(res.msg,'error')
        }
        this.load()//删除后从新加载表格数据
      })
    }
  },

}
</script>

<style scoped>

</style>