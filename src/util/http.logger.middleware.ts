import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {

    private readonly logger = new Logger(this.constructor.name)

    use(request: Request, response: Response, next: NextFunction) {
        const { method, originalUrl } = request;
        const incomingRequest = `${method} ${originalUrl}`
        this.logger.log(">>> Incoming Request:", incomingRequest)

        const now = Date.now();
        response.on('finish', () => {
            const { statusCode, statusMessage } = response;
            const message = `<<< Finished Request: ${incomingRequest} ${statusCode} ${statusMessage} -- ${Date.now() - now}ms`;
            return this.logger[(statusCode == 200) ? "log" : "error"](message);
        });

        next();
    }
}

