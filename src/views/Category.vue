<template>
  <div style="padding: 10px;width: 100vh ">
    <div style="margin: 10px 0">
      <el-dialog title="提示" v-model="dialogVisible" width="30%">
        <el-form :model="form" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="form.name" style="width: 80%"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="save">确 定</el-button>
          </span>
        </template>
      </el-dialog>

    </div>
    <el-table
        :data="tableData"
        stripe
        border
        v-loading="loading"
        row-key="id"
        row-style="text-align: center"
        style="width: 100%">
      <el-table-column prop="name" label="名称"/>
      <el-table-column label="操作">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-button type="primary"  v-if="user.role === 1" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="red"
                @confirm="handleDelete(scope.row.id)"
                title="你确定要删除吗?">
              <template #reference>
                <el-button type="danger"  v-if="user.role === 1" >删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>


</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "Category",
  data(){
    return{
      form:{},
      tableData: [],//表格数据
      loading:true,
      dialogVisible:false,
      user:{},

    }
  },
  //created（）页面加载时调用的方法
  created() {

    let userStr = sessionStorage.getItem("user") || "{}"
    this.user = JSON.parse(userStr)

    request.get("/user/"+this.user.id).then(res=>{
      if (res.code ==='0'){
        this.user = res.data
      }
    })
    this.load();
  },
  methods: {
    load(){
      request.get("/category").then(res=>{
        this.loading = false;
        this.tableData=res.data
      })
    },

    save() {
      request.put("/category", this.form).then(res => {
        if (res.code === '0') {
          this.message("修改成功",'success')
        }else {
          this.message(res.msg,'error')
        }
        this.load()//刷新表格数据
        this.dialogVisible = false//关闭弹窗
        })
    },

    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete(id){
      request.delete("category/"+id).then(res=>{
        if (res.code === '0') {
          this.message("删除成功！",'success')
        }else {
          this.message(res.msg,'error')
        }
        this.load()//删除后从新加载表格数据
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
  }
}
</script>

<style scoped>

</style>