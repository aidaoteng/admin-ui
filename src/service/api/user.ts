import { request } from '../http'
// 获取所有用户信息
export function fetchUserPage(data: any) {
  return request.Get<Service.ResponseResult<Entity.User[]>>('/system/user/list',data)
}
