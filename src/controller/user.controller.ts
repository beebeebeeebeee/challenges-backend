import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ResponseStatus } from 'src/constant/response.status';
import { GenericResponseDto } from 'src/dto/generic.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtPayloadModel } from 'src/model/auth/jwt.payload.mode';
import { GuardRequestModel } from 'src/model/guard.request.model';
import { UserService } from 'src/service/user.service';
import { UserModel } from 'src/typeorm/entity/user.model';

@Controller("/v1/api/user")
export class UserController {

  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get("/info")
  @UseGuards(AuthGuard)
  public async getUserInfo(@Req() request: GuardRequestModel, @Res() response: Response): Promise<void> {
    const { jwt } = request
    const userInfo = await this.userService.getUserInfo(jwt.id)
    response.status(200).send(new GenericResponseDto<UserModel>(ResponseStatus.SUCCESS, userInfo).getResponse())
  }

}
