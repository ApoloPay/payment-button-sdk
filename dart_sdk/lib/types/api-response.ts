export interface ApiSuccessResponse<T = any> {
  status: string,
  message: string,
  result: T
}

export interface ApiErrorResponse {
  statusCode: number,
  message: string,
  error: any,
}

export interface SocketResponse<T = any> {
  success: boolean,
  event: string,
  message: string,
  result: T
}
