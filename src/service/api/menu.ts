import { request } from '../http'

// 获取所有路由信息
export function fetchMenuList(data :any) {
  return request.Post<Service.ResponseResult<AppRoute.RowRoute[]>>('/system/menu/list',data)
}

// 查询菜单详细
export function fetchMenu(menuId : number) {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]>>('/system/menu/'+menuId)
}

// 新增菜单
export function addMenu(data :any) {
  return request.Post<Service.ResponseResult<AppRoute.RowRoute[]>>('/system/menu',data)
}

// 修改菜单
export function updateMenu(data :any) {
  return request.Put<Service.ResponseResult<AppRoute.RowRoute[]>>('/system/menu',data)
}

// 删除菜单
export function delMenu(menuId : string) {
  return request.Delete<Service.ResponseResult<AppRoute.RowRoute[]>>('/system/menu/'+menuId)
}
