import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ErrorConstant } from 'src/constant/error.constant';
import { ResponseStatus } from 'src/constant/response.status';
import { GenericResponseDto } from 'src/dto/generic.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserRequestModel } from 'src/model/auth/create.user.request.model';
import { LoginRequestModel } from 'src/model/auth/login.request.model';
import { LoginResponseModel } from 'src/model/auth/login.response.model';
import { LoginTotpRequestModel } from 'src/model/auth/login.totp.request.model';
import { RegisterTotpResponseModel } from 'src/model/auth/register.totp.response.model';
import { GuardRequestModel } from 'src/model/guard.request.model';

import { AuthService } from '../service/auth.service';

@Controller("/v1/api/auth")
export class AuthController {

  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post("/register/user")
  public async registerUser(@Body() createUserRequestPayload: CreateUserRequestModel, @Res() response: Response): Promise<Response> {
    const createUserResponse = await this.authService.createUser(createUserRequestPayload);
    if (createUserResponse instanceof ErrorConstant) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, createUserResponse).getResponse())
    }

    return response.status(201).send(new GenericResponseDto<LoginResponseModel>(ResponseStatus.SUCCESS).getResponse())
  }

  @Post("/login")
  public async login(@Body() loginRequestPayload: LoginRequestModel, @Res() response: Response): Promise<Response> {
    const loginResponsePayload = await this.authService.login(loginRequestPayload);
    if (loginResponsePayload instanceof ErrorConstant) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, loginResponsePayload).getResponse())
    }

    return response.status(200).send(new GenericResponseDto<LoginResponseModel>(ResponseStatus.SUCCESS, loginResponsePayload).getResponse())
  }

  @Get("/register/totp")
  @UseGuards(AuthGuard)
  public async registerTotp(@Req() request: GuardRequestModel, @Res() response: Response): Promise<Response> {
    const responsePayload = await this.authService.registerTotp(request.jwt.id)
    if (responsePayload instanceof ErrorConstant) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, responsePayload).getResponse())
    }

    return response.status(200).send(new GenericResponseDto<RegisterTotpResponseModel>(ResponseStatus.SUCCESS, responsePayload).getResponse())
  }

}
