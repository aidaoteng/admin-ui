import { request } from '../http'

// 获取所有角色列表
export function fetchRoleList() {
  return request.Get<Service.ResponseResult<Entity.Role[]>>('/system/role/list')
}


export function fetchRolePage(data: any) {
  return request.Post<Service.ResponseResult<Entity.Role[]>>('/system/role/page',data)
}
