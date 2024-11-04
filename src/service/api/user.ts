import { request } from '../http'
// 获取所有用户信息
export function fetchUserPage(data: any) {
  return request.Post<Service.ResponseResult<Entity.User[]>>('/system/user/page',data)
}
