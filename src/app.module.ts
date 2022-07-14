import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import { UserController } from 'src/controller/user.controller';
import { WalletController } from 'src/controller/wallet.controller';
import { PriceService } from 'src/service/price.service';
import { UserService } from 'src/service/user.service';
import { WalletService } from 'src/service/wallet.service';
import { TransactionModel } from 'src/typeorm/entity/transaction.model';
import { UserModel } from 'src/typeorm/entity/user.model';
import { WalletModel } from 'src/typeorm/entity/wallet.model';
import { HttpLoggerMiddleware } from 'src/util/http.logger.middleware';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            hideObject: true,
            messageFormat: '[{context} - {req.id}] {msg}'
          }
        },
      }
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(__dirname, '../database/backend.db'),
      entities: [
        UserModel,
        WalletModel,
        TransactionModel
      ],
      synchronize: true
    }),
    TypeOrmModule.forFeature([
      UserModel,
      WalletModel,
      TransactionModel
    ]),
    HttpModule
  ],
  controllers: [
    AuthController,
    UserController,
    WalletController
  ],
  providers: [
    AuthService,
    UserService,
    PriceService,
    WalletService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
