import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { ErrorConstant } from "src/constant/error.constant";

export class LoginRequestModel {

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNotEmpty({ message: ErrorConstant.VALIDATION__IS_NOT_EMPTY.getJsonString() })
    @IsString({ message: ErrorConstant.VALIDATION__IS_STRING.getJsonString() })
    account: string

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNotEmpty({ message: ErrorConstant.VALIDATION__IS_NOT_EMPTY.getJsonString() })
    @IsString({ message: ErrorConstant.VALIDATION__IS_STRING.getJsonString() })
    password: string

}