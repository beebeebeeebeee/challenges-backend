import { ErrorConstant } from "src/constant/error.constant";
import { ResponseStatus } from "src/constant/response.status";
import { GenericResponseModel } from "src/model/generic.response.model";

export class GenericResponseDto<T = any> {

    private response: GenericResponseModel<T>

    constructor(status: ResponseStatus, data?: T, errorConstant?: ErrorConstant) {
        this.response = {
            status,
            ...(errorConstant ? errorConstant.getJson() : {}),
            ...(data ? { data } : {}),
        }
    }

    public getResponse() {
        return this.response;
    }
}