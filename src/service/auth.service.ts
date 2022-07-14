import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ErrorConstant } from 'src/constant/error.constant';
import { CreateUserRequestModel } from 'src/model/auth/create.user.request.model';
import { LoginRequestModel } from 'src/model/auth/login.request.model';
import { LoginResponseModel } from 'src/model/auth/login.response.model';
import { WalletService } from 'src/service/wallet.service';
import { UserModel } from 'src/typeorm/entity/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  private readonly JWT_SECRET: string

  constructor(
    @InjectRepository(UserModel) private readonly userRepository: Repository<UserModel>,
    private readonly configService: ConfigService,
    private readonly walletService: WalletService
  ) {
    this.JWT_SECRET = this.configService.get<string>("JWT_SECRET")
  }

  public async createUser(createUserRequestPayload: CreateUserRequestModel): Promise<ErrorConstant | null> {
    const { account, password, password2 } = createUserRequestPayload
    if (password !== password2) return ErrorConstant.AUTH__PASSWORD2_IS_NOT_SAME

    const dbUser = await this.userRepository.findOne({ where: { account } })
    if (dbUser != null) return ErrorConstant.AUTH__USER_EXIST

    const userEntity: UserModel = {
      account,
      password: this.hashPassword(password)
    }
    const inserResult = await this.userRepository.insert(userEntity)
    await this.walletService.createDefaultWallet(inserResult.identifiers[0].id)
    return
  }

  public async login(loginRequestPayload: LoginRequestModel): Promise<ErrorConstant | LoginResponseModel> {
    const { account, password } = loginRequestPayload

    const dbUser = await this.userRepository.findOne({ where: { account } })
    if (dbUser == null) return ErrorConstant.AUTH__USER_NOT_FOUND

    if (!bcrypt.compareSync(password, dbUser.password)) return ErrorConstant.AUTH__PASSWORD_INCORRECT

    const token: string = jwt.sign({ id: dbUser.id, account }, this.JWT_SECRET)
    return { token };
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password)
  }

}
