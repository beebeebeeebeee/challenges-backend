import { WalletType } from "src/model/wallet/wallet.type"

export interface DefaultWalletModel {
    type: WalletType
    balance: number
}