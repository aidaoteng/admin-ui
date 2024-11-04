<template>
  <div>
    <NSpace vertical size="large">
      <!-- 查询-->
      <n-card>
        <n-form ref="formRef" :model="queryParams" label-placement="left" inline :show-feedback="false">
          <n-flex>
            <n-form-item label="角色ID" path="roleId">
              <n-input v-model:value="queryParams.roleId" placeholder="请输入"  :allow-input="onlyAllowNumber" clearable/>
            </n-form-item>
            <n-form-item label="角色名称" path="roleName">
              <n-input v-model:value="queryParams.roleName" placeholder="请输入" clearable/>
            </n-form-item>

            <n-flex class="ml-auto">
              <NButton type="primary" @click="getList">
                <template #icon>
                  <icon-park-outline-search/>
                </template>
                搜索
              </NButton>
              <NButton strong secondary @click="resetQuery">
                <template #icon>
                  <icon-park-outline-redo />
                </template>
                重置
              </NButton>
            </n-flex>

          </n-flex>
        </n-form>
      </n-card>

      <!-- 表格 -->
      <n-card>
        <div class="flex gap-4 mb-4">
          <NButton type="primary" @click="handleAddTable">
            <template #icon>
              <icon-park-outline-add-one/>
            </template>
            新建角色
          </NButton>
          <NButton strong secondary class="ml-a">
            <template #icon>
              <icon-park-outline-download/>
            </template>
            导出
          </NButton>
        </div>

        <vxe-table ref="tableRef" :loading="loading" :column-config="{resizable: true}" :row-config="{isHover: true}"  border round :data="dataList" size="small">
          <vxe-column field="roleId" align="center" title="角色ID"></vxe-column>
          <vxe-column field="roleName" title="角色名称" show-overflow></vxe-column>
          <vxe-column field="roleKey" title="角色权限字符串" show-overflow></vxe-column>
          <vxe-column field="roleSort" align="center" title="显示顺序" show-overflow></vxe-column>
          <vxe-column field="dataScope" align="center" title="数据范围" show-overflow></vxe-column>
          <vxe-column field="menuCheckStrictly" title="菜单树选择项是否关联显示" show-overflow></vxe-column>
          <vxe-column field="status" align="center" title="角色状态" show-overflow></vxe-column>
          <vxe-column field="createTime" align="center" title="操作时间" show-overflow></vxe-column>
          <vxe-column title="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <n-button type="primary" size="small" @click="handleUpdate(row)" class="ml2">修改</n-button>
              <n-button type="error" size="small" @click="handleDelete(row)" class="ml2">删除</n-button>
            </template>
          </vxe-column>
          <template #empty>
            <n-empty description="没有数据">
            </n-empty>
          </template>
        </vxe-table>

        <Pagination :count="total" @change="changePage"/>
      </n-card>
    </NSpace>
  </div>
</template>


<script setup lang="tsx">
import {fetchRolePage} from '@/service'
import {FormItemRule, NButton, NSpace} from "naive-ui";

const dataList = ref([]);
const loading = ref(false)
const total = ref(0);
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roleId: null,
    roleName: null,
  },
  form: {},
  rules: {
    menuName: {
      required: true,
    },
    path: {
      required: true,
      message: '请输入菜单路径',
      trigger: 'blur',
    },
    componentPath: {
      required: true,
      message: '请输入组件路径',
      trigger: 'blur',
    },
    title: {
      required: true,
      message: '请输入菜单标题',
      trigger: 'blur',
    },
  }
});
const {form, queryParams} = toRefs(data);
const onlyAllowNumber = (value: string) => {
    return !value || /^\d+$/.test(value);
};

function getList() {
  loading.value = true;
  fetchRolePage(queryParams.value).then((res: any) => {
    loading.value = false;
    dataList.value = res.data.list as [];
    total.value = res.data.total;
  })
}

function changePage(page: number, size: number) {
  queryParams.value.pageNum = page;
  queryParams.value.pageSize = size;
  getList()
}

function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    roleId: null,
    roleName: null,
  };
  getList();
}


onMounted(() => {
  loading.value = true;
  getList()
})

</script>

