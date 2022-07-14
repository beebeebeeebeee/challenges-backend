import { ResponseStatus } from "src/constant/response.status"

export interface GenericResponseModel<T = any> {
    status: ResponseStatus
    code?: string
    msg?: string
    data?: T
}