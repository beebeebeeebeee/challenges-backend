import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { GenericExceptionFilter } from 'src/util/generic.exception';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. init app
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {bufferLogs: true, cors: true});

  // 2. get config
  const configService: ConfigService = app.get(ConfigService)
  const PORT = configService.get("PORT") || 3000

  // 3. setup app
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => new BadRequestException(validationErrors),
    transform: true
  }))
  app.useGlobalFilters(new GenericExceptionFilter())
  const logger: Logger = app.get(Logger)
  app.useLogger(logger)

  // 4. listen port
  app.listen(PORT).then(() => logger.log(`Service is listening on http://localhost:${PORT}`));
}
bootstrap();
