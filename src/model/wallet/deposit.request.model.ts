import { Type } from "class-transformer"
import { IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"
import { ErrorConstant } from "src/constant/error.constant"
import { WalletType } from "src/model/wallet/wallet.type"

class DepositRequestAmountModel {

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNotEmpty({ message: ErrorConstant.VALIDATION__IS_NOT_EMPTY.getJsonString() })
    @IsString({ message: ErrorConstant.VALIDATION__IS_STRING.getJsonString() })
    target: "from" | "to"

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNumber({}, { message: ErrorConstant.VALIDATION__IS_NUMBER.getJsonString() })
    value: number

}


export class DepositRequestModel {

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNotEmpty({ message: ErrorConstant.VALIDATION__IS_NOT_EMPTY.getJsonString() })
    @IsString({ message: ErrorConstant.VALIDATION__IS_STRING.getJsonString() })
    from: WalletType

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNotEmpty({ message: ErrorConstant.VALIDATION__IS_NOT_EMPTY.getJsonString() })
    @IsString({ message: ErrorConstant.VALIDATION__IS_STRING.getJsonString() })
    to: WalletType

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @ValidateNested()
    @Type(() => DepositRequestAmountModel)
    amount: DepositRequestAmountModel

    @IsDefined({ message: ErrorConstant.VALIDATION__IS_DEFINED.getJsonString() })
    @IsNumber({}, { message: ErrorConstant.VALIDATION__IS_NUMBER.getJsonString() })
    currentRate: number

}