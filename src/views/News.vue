<template>
  <div style="padding: 10px;width: 100vh ">
    <!--    查询-->
    <div style="margin-bottom: 10px">
      <el-input v-model="input"
                placeholder="查询标题"
                style="width: 200px"
                clearable/>
      <el-button type="primary" style="margin-left: 10px" @click="load">查询</el-button>
      <el-button type="primary" @click="add" style="margin-left: 10px">新增</el-button>

    </div>
    <!--    表格数据-->
    <div>
      <el-table
          :data="tableData"
          stripe
          border
          v-loading="loading"
          row-style="text-align: center"
          style="width: 100%">
        <el-table-column prop="id" label="ID" sortable/>
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="author" label="作者"/>
        <el-table-column prop="time" type="data" label="时间"/>
        <el-table-column label="操作">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-button type="primary" @click="details(scope.row)">详情</el-button>
              <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)"
                  title="你确定要删除吗?">
                <template #reference>
                  <el-button type="danger">删除</el-button>
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
    <!--   新增对话框-->
    <el-dialog v-model="centerDialogVisible" :title="title" width="50%" center>
      <el-form :model="form">
        <el-form-item label="标题:">
          <el-input v-model="form.title" style="width: 50%"/>
        </el-form-item>
        <el-form-item>
          <div style="border: 1px solid #ccc">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                style="height: 500px; overflow-y: hidden;"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
                @onChange="handleChange"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button :plain="true" type="primary" @click="save">确认</el-button>
          </span>
      </template>
    </el-dialog>

    <!--    详情对话框-->
    <el-dialog v-model="vis" title="详情" width="50%" center>
      <!--      卡片-->
      <el-card>
        <div v-html="detail.content" style="min-height: 100px ;"></div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from 'element-plus'
//文本编辑器导入
//vue的使用
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, } from 'vue'
import { Editor, Toolbar  } from '@wangeditor/editor-for-vue'

const {InfoFilled} = require("@element-plus/icons-vue")
const right = require("@element-plus/icons-vue/dist/es/right.mjs")


export default {
  name: "Home",
  components: {
    Editor, Toolbar
  },
  setup(){
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref("")

    // 模拟 ajax 异步获取内容，初始化数据
    // onMounted(() => {
    //   setTimeout(() => {
    //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
    //   }, 1500)
    // })


    const toolbarConfig = {}
    const editorConfig = { placeholder: '请输入内容...' ,MENU_CONF: {} }


    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    editorConfig.MENU_CONF['uploadImage'] = {
      server: 'http://localhost:9090/files/editor/upload',//上传地址
      fieldName: 'file',//设置上传参数名称
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
    };
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
      tableData: [],//表格数据
      title: "", //表单标题
      vis: false,//详情弹窗开/关
      detail: {},//详情的内容

    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    //详情展示
    details(row) {
      this.detail = row
      this.vis=true
    },
    //富文本发生改变时
    handleChange(editor) {
      this.vHtml = editor.getHtml()//获取内容的html
    },

    //文件上传
    filesUploadSuccess(res) {
      this.form.headImg = res.data
      console.log(res)
    },
    //页面加载
    load() {
      request.get("/news", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.input
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    add() {
      this.title = '添加新闻'
      // 显示对话框
      this.centerDialogVisible = true
      //清空表单内容
      this.form = {}
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
    save() {
      this.form.content = this.valueHtml;//获取编辑器里面的值.然后赋予实体对象
      console.log(this.form)
      //如果form有id就返回ture，没有则反之
      if (this.form.id) {//更新
        request.put("/news", this.form).then(res => {
          if (res.code === '0') {
            this.message("修改成功", 'success')
          } else {
            this.message(res.msg, 'error')
          }
          this.load()//刷新表格数据
          this.centerDialogVisible = false//关闭弹窗
        })
      } else {//新增
        let userStr = sessionStorage.getItem("user") || "{}"//获取user，没有的话就为空对象
        let user = JSON.parse(userStr)
        this.form.author = user.nickName
        request.post("/news/register", this.form).then(res => {
          if (res.code === '0') {
            this.message("添加成功！", 'success')
            this.load()//刷新表格数据
            this.centerDialogVisible = false//关闭弹窗
          } else {
            this.message(res.msg, 'error')
          }
        })
      }
    },
    handleSizeChange(val) { //改变当前每页的个数触发
      this.pageSize = val
      this.load()
    },
    handleCurrentChange(val) {//改变当前页码触发
      this.currentPage = val
      this.load();
    },
    handleEdit(row) {
      //JSON.parse(JSON.stringify(row))表示成为独立对象
      this.valueHtml=row.content
      this.title = "修改新闻信息"
      this.form = JSON.parse(JSON.stringify(row))
      this.centerDialogVisible = true

    },
    handleDelete(id) {
      request.delete("news/" + id).then(res => {
        if (res.code === '0') {
          this.message("删除成功！", 'success')
        } else {
          this.message(res.msg, 'error')
        }
        this.load()//删除后从新加载表格数据
      })
    }
  },

}
</script>

<style scoped>

</style>