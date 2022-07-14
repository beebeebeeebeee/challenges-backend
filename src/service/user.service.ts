import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/typeorm/entity/user.model';
import { WalletModel } from 'src/typeorm/entity/wallet.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {


  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserModel) private readonly userRepository: Repository<UserModel>,
    @InjectRepository(WalletModel) private readonly walletRepository: Repository<WalletModel>
  ) {
  }

  public async getUserInfo(id: number): Promise<UserModel> {
    const responsePayload = await this.userRepository.findOne({ where: { id }, relations: ["wallets"] })
    delete responsePayload.password
    delete responsePayload.totp
    return responsePayload
  }

}
