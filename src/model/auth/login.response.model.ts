/**
 * case: normal login -> success
 * if user not set totp, return token and totp = false
 * if user have set totp, return only totp = true
 * 
 * case: totp login -> success
 * return token and totp = true
 */
export interface LoginResponseModel {
    token?: string
    totp: boolean
}
