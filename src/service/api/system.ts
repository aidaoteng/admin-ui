import { request } from '../http'

// 获取所有路由信息
export function fetchAllRoutes() {
  return request.Get<Service.ResponseResult<AppRoute.RowRoute[]>>('/system/menu/getUserRoutes')
}


// 获取所有字典列表
export function fetchDictList(code: string) {
  return request.Get<Service.ResponseResult<Entity.Dict[]>>('/dict/list')
}

// 获取所有字典列表
export function fetchDictContent(id: number) {
  const params = { id }
  return request.Get<Service.ResponseResult<Entity.Dict[]>>('/dict/contentById', { params })
}
