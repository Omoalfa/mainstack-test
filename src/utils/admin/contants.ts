
export enum EPermisions {
  SUDO = '*',
  READ_ADMIN = 'admin.read',
  UPDATE_ADMIN = 'admin.update',
  DELETE_ADMIN = 'admin.delete',
  CREATE_ADMIN = 'admin.create',
  SUDO_ADMIN = 'admin.*',
  READ_PROD = 'prod.read',
  UPDATE_PROD = 'prod.update',
  DELETE_PROD = 'prod.delete',
  CREATE_PROD = 'prod.create',
  READ_ORDER = 'order.read',
  UPDATE_ORDER = 'order.update',
  DELETE_ORDER = 'order.delete',
  CREATE_ORDER = 'order.create',
  SUDO_ORDER = 'order.*',
  READ_USER = 'user.read',
  UPDATE_USER = 'user.update',
  DELETE_USER = 'user.delete',
  CREATE_USER = 'user.create',
  SUDO_USER = 'user.*',
}

export const permission_divider = " =::"
