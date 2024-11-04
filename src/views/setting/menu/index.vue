<template>
  <div>
    <!-- 表格 -->
    <n-card>
      <template #header>
        <div class="flex gap-4">
          <NButton type="primary" @click="handleAdd">
            <template #icon>
              <icon-park-outline-add-one/>
            </template>
            新建
          </NButton>

          <NButton strong secondary @click="expandAllEvent">
            <template #icon>
              <icon-park-outline-afferent/>
            </template>
            展开
          </NButton>
          <NButton strong secondary @click="claseExpandEvent">
            <template #icon>
              <icon-park-outline-download/>
            </template>
            关闭所有
          </NButton>
        </div>
      </template>
      <vxe-table
        ref="tableRef"
        @toggle-tree-expand="toggleExpandChangeEvent"
        :loading="loading"
        :column-config="{resizable: true}"
        :tree-config="{transform: true, rowField: 'menuId', parentField: 'parentId'}"
        border round :data="menuList">
        <vxe-column title="菜单名称" width="300" tree-node>
          <template #default="{ row }">
            <span class="inline-block align-middle"><nova-icon :icon="row.icon"/></span>
            <span class="pl2">{{ row.title }}</span>
          </template>
        </vxe-column>
        <vxe-column field="menuId" width="80" align="center" title="菜单ID"></vxe-column>
        <vxe-column field="path" title="路径" show-overflow></vxe-column>
        <vxe-column field="component" width="200" title="组件" show-overflow></vxe-column>
        <vxe-column field="menuType" width="80" align="center" title="类型" show-overflow></vxe-column>
        <vxe-column field="orderNum" width="80" align="center" title="排序" show-overflow></vxe-column>
        <vxe-column field="perms" title="权限" show-overflow></vxe-column>
        <vxe-column field="isFrame" width="80" align="center" title="外链" show-overflow></vxe-column>
        <vxe-column field="visible" width="100" align="center" title="显示/隐藏" show-overflow></vxe-column>
        <vxe-column title="操作" width="180" align="center"  fixed="right">
          <template #default="{ row }">
            <n-button type="info" size="small" @click="handleAdd(row)">添加</n-button>
            <n-button type="primary" size="small" @click="handleUpdate(row)" class="ml2">修改</n-button>
            <n-button type="error" size="small" @click="handleDelete(row)" class="ml2">删除</n-button>
          </template>
        </vxe-column>
      </vxe-table>
    </n-card>

    <!-- 添加/修改-->
    <n-modal
      v-model:show="open" :mask-closable="false" preset="card" :title="title" class="w-800px"
      transform-origin="center"
      :segmented="{
      content: true,
      action: true,
    }"
    >
      <n-form
        ref="formRef"
        :rules="rules" label-placement="left" :label-width="120"
        :model="form"
        size="medium"
      >
        <n-grid :cols="2" :x-gap="18">
          <n-form-item-grid-item :span="2" path="pid">
            <template #label>
              父级目录
              <HelpInfo message="不填写则为顶层菜单"/>
            </template>
            <n-tree-select
              v-model:value="form.parentId" filterable clearable :options="dirTreeOptions" key-field="id"
              label-field="title" children-field="children" placeholder="请选择父级目录"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="1" label="菜单名称" path="menuName">
            <n-input v-model:value="form.menuName" placeholder="Eg: system"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="1" label="标题" path="title">
            <n-input v-model:value="form.title" placeholder="Eg: 角色"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="2" label="路由路径" path="path">
            <n-input v-model:value="form.path" placeholder="Eg: /system/user"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="1" label="菜单类型" path="menuType">
            <n-radio-group v-model:value="form.menuType" name="radiogroup">
              <n-space>
                <n-radio value="M">
                  目录
                </n-radio>
                <n-radio value="C">
                  页面
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="1" label="图标" path="icon">
            <icon-select v-model:value="form.icon"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="form.menuType === 'C'" :span="2" label="组件路径" path="componentPath">
            <n-input v-model:value="form.component" placeholder="Eg: /system/user/index.vue"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="2" path="perms" label="菜单权限">
            <n-input v-model:value="form.perms"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="2" path="roles">
            <template #label>
              访问角色
              <HelpInfo message="不填写则表示所有角色都可以访问"/>
            </template>
            <n-select
              v-model:value="form.roles" multiple filterable
              label-field="roleName"
              value-field="roleId"
              :options="options"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="1" path="order">
            <template #label>
              菜单排序
              <HelpInfo message="数字越小，同级中越靠前"/>
            </template>
            <n-input-number v-model:value="form.orderNum"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="form.menuType === 'C'" :span="1" path="href">
            <template #label>
              外链页面
              <HelpInfo message="填写后，点击菜单将跳转到该地址，组件路径任意填写"/>
            </template>
            <n-input v-model:value="form.href" placeholder="Eg: https://example.com"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="1" label="侧边菜单隐藏" path="hide">
            <n-switch v-model:value="form.visible"/>
          </n-form-item-grid-item>
          <n-form-item-grid-item
            v-if="form.menuType === 'C' && form.visible" :span="2"
            path="activeMenu"
          >
            <template #label>
              高亮菜单
              <HelpInfo message="当前路由不在左侧菜单显示，但需要高亮某个菜单"/>
            </template>
            <n-input v-model:value="form.activeMenu"/>
          </n-form-item-grid-item>

        </n-grid>
      </n-form>
      <n-space justify="center">
        <n-button @click="closeModal">
          取消
        </n-button>
        <n-button type="primary" :loading="submitLoading" @click="submitForm">
          提交
        </n-button>
      </n-space>
    </n-modal>
  </div>
</template>


<script setup lang="ts">
import {addMenu, delMenu, fetchAllRoutes, fetchMenu, fetchMenuList, fetchRoleList, updateMenu} from "@/service";
import HelpInfo from "@/components/common/HelpInfo.vue";
import {FormItemRule, NButton} from "naive-ui";
import {Regex} from "@/constants";
import {arrayToTree} from "@/utils";
import {VxeTableEvents, VxeTableInstance} from "vxe-table";

const formRef = ref()
const menuList = ref([]);
const loading = ref(false)
const submitLoading = ref(false)
const open = ref(false);
const title = ref("");
const menuSelectList = ref([]);

const data = reactive({
  form: {
    menuId: undefined,
    parentId: 0,
    menuName: '',
    title: '',
    icon: undefined,
    menuType: "M",
    orderNum: undefined,
    isFrame: 0,
    href: undefined,
    isCache: 0,
    visible: 0,
    status: 0,
    component: '',
    requiresAuth: true,
    path: '',
    roles: []
  },
  queryParams: {
    menuName: undefined,
    visible: undefined
  },
  rules: {
    menuName: {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value)
          return new Error('请输入菜单名称')

        if (!new RegExp(Regex.RouteName).test(value))
          return new Error('菜单只能包含英文数字_!@#$%^&*~-')

        return true
      },
      trigger: 'blur',
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
  },
});
const {form, rules} = toRefs(data);

// 查询
function getList() {
  fetchMenuList({}).then((res) => {
    loading.value = false;
    menuList.value = res.data as []
  })
}

/** 取消按钮 */
function closeModal() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    menuId: undefined,
    parentId: 0,
    menuName: '',
    title: '',
    icon: undefined,
    menuType: "M",
    orderNum: undefined,
    isFrame: 0,
    href: undefined,
    isCache: 0,
    visible: 0,
    status: 0,
    component: '',
    requiresAuth: true,
    path: '',
    roles: []
  };
}

// 添加

/** 新增按钮操作 */
function handleAdd(row: any) {
  reset();
  fetchAllRoutes().then((res) => {
    menuSelectList.value = arrayToTree(res.data) as [];
    console.log('row.menuId->', row.menuId)
    if (row.menuId) {
      form.value.parentId = row.menuId;
    } else {
      form.value.parentId = 0;
    }

    getRoleList()
  });

  open.value = true;
  title.value = "添加菜单";
}

/** 修改按钮操作 */
function handleUpdate(row: any) {
  reset();
  fetchAllRoutes().then((res) => {
    menuSelectList.value = arrayToTree(res.data) as [];
  });
  fetchMenu(row.menuId).then(response => {
    form.value = response.data as any;
    open.value = true;
    title.value = "修改菜单";
    getRoleList()
  });
}

/** 提交按钮 */
function submitForm() {
  if (formRef.value?.validate()) {
    if (form.value.menuId != undefined) {
      updateMenu(form.value).then(response => {
        window.$message.success('修改成功')
        open.value = false;
        getList();
      });
    } else {
      addMenu(form.value).then(response => {
        window.$message.success('新增成功')
        open.value = false;
        getList();
      });
    }
  }
}

// 删除按钮操作
function handleDelete(row: any) {
  window.$dialog.warning({
    title: '提示',
    content: '是否确认删除名称为"' + row.menuName + '"的数据项?',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      delMenu(row.menuId).then((response) => {
        window.$message.success('删除成功')
      });
      getList()
    },
  })
}

// 角色
const options = ref<Entity.Role[]>([])

function getRoleList() {
  fetchRoleList().then((res) => {
    options.value = res.data as []
  })
}

const dirTreeOptions = computed(() => {
  return filterDirectory(menuSelectList.value)
})

function filterDirectory(node: any[]) {
  return node.filter((item) => {
    if (item.children) {
      const childDir = filterDirectory(item.children)
      if (childDir.length > 0)
        item.children = childDir
      else
        Reflect.deleteProperty(item, 'children')
    }
    // return (item.menuType === 'dir')
    return true
  })
}


const tableRef = ref<VxeTableInstance>()
const expandAllEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.setAllTreeExpand(true)
  }
}

const claseExpandEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.clearTreeExpand()
  }
}

const toggleExpandChangeEvent: VxeTableEvents.ToggleTreeExpand = (params) => {
  const $table = tableRef.value
  if ($table) {
    const {row, expanded} = params
    console.log('节点展开事件', expanded, '获取父节点：', $table.getParentRow(row))
  }
}

// 初始
onMounted(() => {
  loading.value = true;
  getList()
})


</script>
