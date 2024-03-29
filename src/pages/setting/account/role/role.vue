<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px">
        <el-form-item label="角色信息">
          <el-input style="width: 240px" maxlength="50" clearable placeholder="请输入角色名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="km-role-search" @click="search" :loading="cxLoading">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" plain icon="el-icon-plus" v-permission="'ACCOUNT_ROLE_ADD'" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table v-loading="tableLoading" :max-height="tabMaxHeight" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="角色名称"> </el-table-column>
        <el-table-column prop="remark" label="描述"> </el-table-column>
        <el-table-column prop="num" label="关联账号数量" header-align="left" align="right">
          <template slot-scope="scope">
            <div class="table-num">{{ scope.row.num }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column label="操作" align="right">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small" v-permission="'ACCOUNT_ROLE_EDIT'">编辑</el-button>
            <el-popconfirm
              v-permission="'ACCOUNT_ROLE_DEL'"
              v-if="!scope.row.code"
              style="margin-left: 12px"
              iconColor="#FFA033"
              title="确定删除所选数据吗？"
              placement="top-start"
              @confirm="del(scope.row)">
              <el-button slot="reference" type="text" size="small">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { queryPage, deleteSysRole } from '@/api/setting/account'
import { mapActions } from 'vuex'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

export default {
  name: 'roleManagement',
  mixins: [tableMaxHeight],
  data() {
    return {
      form: {
        name: ''
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      tableLoading: false,
      cxLoading: false
    }
  },
  activated() {
    this.getList()
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions(['delCachedView']),
    search() {
      this.cxLoading = true
      this.currentPage = 1
      this.getList()
    },
    add() {
      this.delCachedView({ name: 'roleAdd' }).then(() => {
        this.$router.push({ name: 'roleAdd' })
      })
    },
    edit(row) {
      this.delCachedView({ name: 'roleAdd' }).then(() => {
        this.$router.push({ name: 'roleAdd', query: { id: row.id } })
      })
    },
    async del(row) {
      if (row.num) {
        this.$message.error({ message: '角色有关联的账号，不能删除' })
        return
      }
      try {
        await deleteSysRole({ roleId: row.id })
        if (this.tableData.length - 1 === 0) this.currentPage = Math.ceil((this.total - 1) / this.pageSize) || 1
        this.getList()
        this.$message.success({ message: '删除成功!' })
      } catch (e) {}
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList()
    },
    async getList() {
      this.tableLoading = true
      let data = {
        name: this.form.name,
        page: this.currentPage,
        rows: this.pageSize
      }
      try {
        let res = await queryPage(data)
        this.tableData = res.results
        this.total = res.totalCount
      } catch (e) {
      } finally {
        this.cxLoading = false
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
.km-role-search {
  padding: 8px 22px;
}
.table-num {
  width: 82px;
}
</style>
