import { request } from '../http'

interface Ilogin {
    username: string
    password: string
    code: string
    uuid: string
}

export function fetchLogin(data: Ilogin) {
    const methodInstance = request.Post<Service.ResponseResult<Api.Login.Info>>('/auth/login', data)
    methodInstance.meta = {
        authRole: null,
    }
    return methodInstance
}
export function fetchUpdateToken(data: any) {
    const method = request.Post<Service.ResponseResult<Api.Login.Info>>('/updateToken', data)
    method.meta = {
        authRole: 'refreshToken',
    }
    return method
}

export function fetchUserRoutes(params: { id: number }) {
    return request.Get<Service.ResponseResult<AppRoute.RowRoute[]> >('/system/menu/getUserRoutes', { params })
}



export function fetchVerCode() {
  return request.Get<Service.ResponseResult<Api.Login.VerCode> >('/code' )
}
