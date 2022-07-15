import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { ErrorConstant } from "src/constant/error.constant";
import { LoginRequestModel } from "src/model/auth/login.request.model";

export class LoginTotpRequestModel extends LoginRequestModel {

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNotEmpty({ message: ErrorConstant.VALIDATION__IS_NOT_EMPTY.getJsonString() })
    @IsString({ message: ErrorConstant.VALIDATION__IS_STRING.getJsonString() })
    otp?: string

}