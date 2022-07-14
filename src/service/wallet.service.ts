import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorConstant } from 'src/constant/error.constant';
import { DefaultWalletModel } from 'src/model/wallet/default.wallet.model';
import { DepositRequestModel } from 'src/model/wallet/deposit.request.model';
import { DepositResponseModel } from 'src/model/wallet/deposit.response.model';
import { WalletType } from 'src/model/wallet/wallet.type';
import { TransactionModel } from 'src/typeorm/entity/transaction.model';
import { UserModel } from 'src/typeorm/entity/user.model';
import { WalletModel } from 'src/typeorm/entity/wallet.model';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {

  private readonly DEFAULT_WALLET: DefaultWalletModel[]

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserModel) private readonly userRepository: Repository<UserModel>,
    @InjectRepository(WalletModel) private readonly walletRepository: Repository<WalletModel>,
    @InjectRepository(TransactionModel) private readonly transactionRepository: Repository<TransactionModel>
  ) {
    this.DEFAULT_WALLET = this.configService.get<string>("DEFAULT_WALLET").split(",").map(e => {
      const [type, balance] = e.trim().split("=")
      const defaultWallet: DefaultWalletModel = { type: type as WalletType, balance: parseFloat(balance) }
      return defaultWallet
    })
  }

  public async createDefaultWallet(userId: number): Promise<void> {
    const insertPayloadList = this.DEFAULT_WALLET.map(e => {
      const insertPayload: WalletModel = {
        user_id: userId,
        ...e
      }
      return insertPayload
    })
    await this.walletRepository.insert(insertPayloadList)
  }

  public async depositPreview(requestPayload: DepositRequestModel, userId: number): Promise<ErrorConstant | DepositResponseModel> {
    const { from, to, currentRate, amount } = requestPayload
    const { target, value } = amount

    const dbUser = await this.userRepository.findOne({ where: { id: userId }, relations: ["wallets"] })
    const wallet = {
      from: dbUser.wallets?.find(each => each.type == from),
      to: dbUser.wallets?.find(each => each.type == to)
    }

    if (wallet.from == null || wallet.to == null) return ErrorConstant.WALLET__WALLET_NOT_FOUND

    let returnPayload: DepositResponseModel
    if (target == "from") {
      returnPayload = {
        from: value,
        to: wallet.from.type == "BTC" ? value * currentRate : value / currentRate
      }
    } else {
      returnPayload = {
        from: wallet.to.type == "BTC" ? value * currentRate : value / currentRate,
        to: value
      }
    }

    if (wallet.from.balance < returnPayload.from) return ErrorConstant.WALLET__BALANCE_NOT_ENOUGH

    return returnPayload
  }

  public async depositTransfer(previewPayload: DepositResponseModel, requestPayload: DepositRequestModel, userId: number): Promise<ErrorConstant | void> {
    const dbUserWallets = await this.walletRepository.find({ where: { user_id: userId } })
    const wallet = {
      from: dbUserWallets?.find(each => each.type == requestPayload.from),
      to: dbUserWallets?.find(each => each.type == requestPayload.to)
    }

    if (wallet.from == null || wallet.to == null) return ErrorConstant.WALLET__WALLET_NOT_FOUND

    wallet.from.balance -= previewPayload.from
    wallet.to.balance += previewPayload.to

    await this.walletRepository.save(Object.values(wallet))

    const transaction: TransactionModel = {
      user_id: userId,
      from: requestPayload.from,
      to: requestPayload.to,
      fromAmount: previewPayload.from,
      toAmount: previewPayload.to,
      rate: requestPayload.currentRate,
      status: 'SUCCESS'
    }
    await this.transactionRepository.save(transaction)
  }

  public async getTransaction(userId: number): Promise<TransactionModel[]> {
    return await this.transactionRepository.find({ where: { user_id: userId }, order: { id: "DESC" } })
  }
}
