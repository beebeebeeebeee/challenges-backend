export class ErrorConstant {

    public static VALIDATION__IS_DEFINED = new ErrorConstant("10001", "validation.is_defined")
    public static VALIDATION__IS_NOT_EMPTY = new ErrorConstant("10002", "validation.is_not_empty")
    public static VALIDATION__IS_STRING = new ErrorConstant("10003", "validation.is_string")
    public static VALIDATION__IS_NUMBER = new ErrorConstant("10004", "validation.is_number")

    public static AUTH__PASSWORD2_IS_NOT_SAME = new ErrorConstant("20001", "auth.password2_is_not_same")
    public static AUTH__USER_EXIST = new ErrorConstant("20002", "auth.user_exist")
    public static AUTH__USER_NOT_FOUND = new ErrorConstant("20003", "auth.user_not_found")
    public static AUTH__PASSWORD_INCORRECT = new ErrorConstant("20004", "auth.password_incorrect")
    public static AUTH__OTP_INCORRECT = new ErrorConstant("20005", "auth.otp_incorrect")
    public static AUTH__TOTP_IS_ALREADY_REGISTERED = new ErrorConstant("20006", "auth.totp_is_already_registered")

    public static WALLET__PRICE_IS_NOT_UPDATED = new ErrorConstant("30001", "wallet.price_is_not_updated")
    public static WALLET__WALLET_NOT_FOUND = new ErrorConstant("30001", "wallet.wallet_not_found")
    public static WALLET__BALANCE_NOT_ENOUGH = new ErrorConstant("30001", "wallet.balance_not_enough")

    private code: string
    private msg: string

    constructor(code: string, msg: string) {
        this.code = code
        this.msg = msg
    }

    public getCode = () => this.code
    public getMsg = () => this.msg
    public getJson = () => { return { code: this.code, msg: this.msg } }
    public getJsonString = () => { return JSON.stringify(this.getJson()) }

}