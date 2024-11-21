<template>
<div>
  <NSpace vertical size="large">
    <!-- 查询-->
    <n-card>
      <n-form ref="queryRef" :model="queryParams" label-placement="left" inline :show-feedback="false">
        <n-flex>
          <n-form-item label="ID">
            <n-input v-model:value="queryParams.userId" placeholder="请输入" :allow-input="onlyAllowNumber" clearable/>
          </n-form-item>
          <n-form-item label="用户账号">
            <n-input v-model:value="queryParams.userName" placeholder="请输入" clearable/>
          </n-form-item>

          <n-form-item label="用户昵称">
            <n-input v-model:value="queryParams.nickName" placeholder="请输入" clearable/>
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
        <NButton type="primary">
          <template #icon>
            <icon-park-outline-add-one/>
          </template>
          新建用户
        </NButton>
        <NButton strong secondary class="ml-a">
          <template #icon>
            <icon-park-outline-download/>
          </template>
          导出
        </NButton>
      </div>

      <vxe-table ref="tableRef" :loading="loading" :column-config="{resizable: true}" :row-config="{isHover: true}"  border round :data="dataList" size="small">
        <vxe-column field="userId" align="center" title="用户ID"></vxe-column>
        <vxe-column field="userName" title="用户账号" show-overflow></vxe-column>
        <vxe-column field="nickName" title="用户昵称" show-overflow></vxe-column>
        <vxe-column field="userType" align="center" title="类型" show-overflow></vxe-column>
        <vxe-column field="phonenumber" align="center" title="手机号码" show-overflow></vxe-column>
        <vxe-column field="sex" title="用户性别" show-overflow></vxe-column>
        <vxe-column field="status" align="center" title="帐号状态" show-overflow></vxe-column>
        <vxe-column field="createTime" align="center" title="操作时间" show-overflow></vxe-column>
        <vxe-column title="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <n-button type="primary" size="small" class="ml2">修改</n-button>
            <n-button type="error" size="small"  class="ml2">删除</n-button>
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
import {fetchUserPage} from '@/service'
import {NButton, NSpace} from "naive-ui";

const dataList = ref([]);
const loading = ref(false)
const total = ref(0);
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: null,
    userId: null,
    userName: null,
    nickName: null,
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
const {queryParams } = toRefs(data);


const onlyAllowNumber = (value: string) => {
	return !value || /^\d+$/.test(value);
};

function getList() {
  loading.value = true;
  fetchUserPage(queryParams.value).then((res: any) => {
    loading.value = false;
    dataList.value = res.data.records as [];
    total.value = res.data.total;
  })
}

function changePage(page: number, size: number) {
  queryParams.value.pageNum = page;
  queryParams.value.pageSize = size;
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    status: null,
    userId: null,
    userName: null,
    nickName: null,
  };
  getList();
}
onMounted(() => {
  loading.value = true;
  getList()
})

</script>

