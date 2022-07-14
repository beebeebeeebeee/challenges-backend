import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PriceModel } from 'src/model/price/price.model';
import { PriceTickerModel } from 'src/model/price/price.ticker.model';

@Injectable()
export class PriceService {

  private readonly PRICE_API: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.PRICE_API = this.configService.get<string>("PRICE_API")
  }

  public async getPrice(): Promise<PriceTickerModel> {
    const { data } = await this.httpService.axiosRef.get<PriceModel>(this.PRICE_API)
    return data.tickers[0]
  }

  public async validateRate(rate: number): Promise<boolean> {
    return ((await this.getPrice()).price === rate)
  }

}
