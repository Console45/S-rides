export enum Methods {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
}

export enum MetadataKeys {
  METHOD = "method",
  PATH = "path",
  MIDDLEWARE = "middleware",
  VALIDATOR = "validator",
  ROLE = "role",
}

export enum ValidationFields {
  QUERY = "query",
  PARAMS = "params",
  BODY = "body",
}

export enum Allow {
  User = "User",
  Admin = "Admin",
  Manager = "Manager",
}
