import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { ResponseStatus } from 'src/constant/response.status';
import { GenericResponseDto } from 'src/dto/generic.response.dto';


@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception?.response?.message

        if (exception instanceof BadRequestException && message != null && JSON.stringify(Object.keys(message[0])) == JSON.stringify(['target', 'value', 'property', 'children', 'constraints'])) {
            const returnPayload = Object.assign({}, ...message.map(each => {
                return {
                    [each.property]: Object.values(each.constraints).map((constraint: string) => {
                        try {
                            return JSON.parse(constraint)
                        } catch (err) {
                            return constraint
                        }
                    })
                }
            }))

            return response
                .status(status)
                .send(new GenericResponseDto<HttpException>(ResponseStatus.ERROR, returnPayload).getResponse());
        }

        return response
            .status(status)
            .send(new GenericResponseDto<HttpException>(ResponseStatus.ERROR, message).getResponse());
    }
}