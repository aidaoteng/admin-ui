
namespace Api {
  namespace Login {
    /* 登录返回的用户字段, 该数据是根据用户表扩展而来, 部分字段可能需要覆盖，例如id */
    interface Info extends Entity.User {
      /** 用户id */
      id: number
      /** 用户角色类型 */
      role: Entity.RoleType

      // 用户信息
      loginUser: UserInfo

      /** 访问toekn */
      accessToken: string
      /** 刷新toekn */
      refreshToken: string
      clientId: string
    }

    interface VerCode {
      imgBase64: string
      imgUuid: string
    }

    interface UserInfo {
      user: UserVO;
      roles: string[];
      permissions: string[];
    }

    /**
     * 用户返回对象
     */
    interface UserVO {
      userId: string | number;
      tenantId: string;
      deptId: number;
      userName: string;
      nickName: string;
      userType: string;
      email: string;
      phonenumber: string;
      sex: string;
      avatar: string;
      status: string;
      delFlag: string;
      loginIp: string;
      loginDate: string;
      remark: string;
      deptName: string;
      roles: RoleVO[];
      roleIds: any;
      postIds: any;
      roleId: any;
      admin: boolean;
    }
  }
}
