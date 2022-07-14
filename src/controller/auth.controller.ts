import { Body, Controller, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ErrorConstant } from 'src/constant/error.constant';
import { ResponseStatus } from 'src/constant/response.status';
import { GenericResponseDto } from 'src/dto/generic.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserRequestModel } from 'src/model/auth/create.user.request.model';
import { LoginRequestModel } from 'src/model/auth/login.request.model';
import { LoginResponseModel } from 'src/model/auth/login.response.model';

import { AuthService } from '../service/auth.service';

@Controller("/v1/api/auth")
export class AuthController {

  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor(
    private readonly authService: AuthService,
    // private readonly logger: Logger
  ) { }

  @Post("/register/user")
  public async registerUser(@Body() createUserRequestPayload: CreateUserRequestModel, @Res() response: Response): Promise<void> {
    const createUserResponse = await this.authService.createUser(createUserRequestPayload);
    if (createUserResponse == null) {
      response.status(201).send(new GenericResponseDto<LoginResponseModel>(ResponseStatus.SUCCESS).getResponse())
    } else {
      response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, createUserResponse).getResponse())
    }
  }

  @Post("/login")
  public async login(@Body() loginRequestPayload: LoginRequestModel, @Res() response: Response): Promise<void> {
    const loginResponsePayload = await this.authService.login(loginRequestPayload);
    if (!(loginResponsePayload instanceof ErrorConstant)) {
      response.status(200).send(new GenericResponseDto<LoginResponseModel>(ResponseStatus.SUCCESS, loginResponsePayload).getResponse())
    } else {
      response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, loginResponsePayload).getResponse())
    }
  }

  @Post("/register/totp")
  @UseGuards(AuthGuard)
  public async registerTotp(@Res() response: Response): Promise<void> {
  }

}
