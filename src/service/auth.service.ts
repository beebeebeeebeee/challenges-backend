import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as authenticator from 'authenticator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ErrorConstant } from 'src/constant/error.constant';
import { CreateUserRequestModel } from 'src/model/auth/create.user.request.model';
import { LoginResponseModel } from 'src/model/auth/login.response.model';
import { LoginTotpRequestModel } from 'src/model/auth/login.totp.request.model';
import { RegisterTotpResponseModel } from 'src/model/auth/register.totp.response.model';
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

  public async login(loginRequestPayload: LoginTotpRequestModel): Promise<ErrorConstant | LoginResponseModel> {
    const { account, password, otp } = loginRequestPayload

    const dbUser = await this.userRepository.findOne({ where: { account } })
    if (dbUser == null) return ErrorConstant.AUTH__USER_NOT_FOUND

    if (!bcrypt.compareSync(password, dbUser.password)) return ErrorConstant.AUTH__PASSWORD_INCORRECT

    const isTotpEnabled = dbUser.totp != null
    if (isTotpEnabled && otp == null) {
      return { totp: isTotpEnabled }
    }

    if (isTotpEnabled && authenticator.verifyToken(dbUser.totp, otp) == null) return ErrorConstant.AUTH__OTP_INCORRECT

    const token: string = jwt.sign({ id: dbUser.id, account }, this.JWT_SECRET)
    return { token, totp: isTotpEnabled };
  }

  public async registerTotp(userId: number): Promise<ErrorConstant | RegisterTotpResponseModel> {
    const dbUser = await this.userRepository.findOne({ where: { id: userId } })
    if (dbUser == null) return ErrorConstant.AUTH__USER_NOT_FOUND
    if (dbUser.totp != null) return ErrorConstant.AUTH__TOTP_IS_ALREADY_REGISTERED

    const totpKey = authenticator.generateKey();
    dbUser.totp = totpKey
    await this.userRepository.save(dbUser)

    const totpUri = authenticator.generateTotpUri(totpKey, dbUser.account, "Challenges Backend", 'SHA1', 6, 30);
    return { totpUri }
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password)
  }

}
