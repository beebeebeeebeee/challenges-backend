import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ErrorConstant } from 'src/constant/error.constant';
import { ResponseStatus } from 'src/constant/response.status';
import { GenericResponseDto } from 'src/dto/generic.response.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtPayloadModel } from 'src/model/auth/jwt.payload.mode';
import { GuardRequestModel } from 'src/model/guard.request.model';
import { PriceTickerModel } from 'src/model/price/price.ticker.model';
import { DepositRequestModel } from 'src/model/wallet/deposit.request.model';
import { DepositResponseModel } from 'src/model/wallet/deposit.response.model';
import { PriceService } from 'src/service/price.service';
import { WalletService } from 'src/service/wallet.service';
import { TransactionModel } from 'src/typeorm/entity/transaction.model';

@Controller("/v1/api/wallet")
export class WalletController {

  private readonly logger: Logger = new Logger(this.constructor.name)

  constructor(
    private readonly walletService: WalletService,
    private readonly priceService: PriceService
  ) { }

  @Get("/price")
  @UseGuards(AuthGuard)
  public async getPrice(@Res() response: Response): Promise<Response> {
    const responsePayload = await this.priceService.getPrice()
    return response.status(200).send(new GenericResponseDto<PriceTickerModel>(ResponseStatus.SUCCESS, responsePayload).getResponse())
  }

  @Post("/deposit/preview")
  @UseGuards(AuthGuard)
  public async depositPreview(@Req() request: GuardRequestModel, @Body() requestPayload: DepositRequestModel, @Res() response: Response): Promise<Response> {
    if (!await this.priceService.validateRate(requestPayload.currentRate)) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, ErrorConstant.WALLET__PRICE_IS_NOT_UPDATED).getResponse())
    }

    const { jwt } = request
    const responsePayload = await this.walletService.depositPreview(requestPayload, jwt.id)
    if ((responsePayload instanceof ErrorConstant)) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, responsePayload).getResponse())
    }

    return response.status(200).send(new GenericResponseDto<DepositResponseModel>(ResponseStatus.SUCCESS, responsePayload).getResponse())
  }

  @Post("/deposit/action")
  @UseGuards(AuthGuard)
  public async depositAction(@Req() request: GuardRequestModel, @Body() requestPayload: DepositRequestModel, @Res() response: Response): Promise<Response> {
    if (!await this.priceService.validateRate(requestPayload.currentRate)) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, ErrorConstant.WALLET__PRICE_IS_NOT_UPDATED).getResponse())
    }

    const { jwt } = request
    const previewPayload = await this.walletService.depositPreview(requestPayload, jwt.id)
    if ((previewPayload instanceof ErrorConstant)) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, previewPayload).getResponse())
    }

    const transferResponse = await this.walletService.depositTransfer(previewPayload, requestPayload, jwt.id)
    if ((transferResponse instanceof ErrorConstant)) {
      return response.status(400).send(new GenericResponseDto(ResponseStatus.ERROR, null, transferResponse).getResponse())
    }

    return response.status(200).send(new GenericResponseDto<DepositResponseModel>(ResponseStatus.SUCCESS, previewPayload).getResponse())
  }

  @Get("/transaction")
  @UseGuards(AuthGuard)
  public async getTransaction(@Req() request: GuardRequestModel, @Res() response: Response): Promise<Response> {
    const reponsePayload = await this.walletService.getTransaction(request.jwt.id)
    return response.status(200).send(new GenericResponseDto<TransactionModel[]>(ResponseStatus.SUCCESS, reponsePayload).getResponse())
  }

}
