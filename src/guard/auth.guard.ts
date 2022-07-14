import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { verify } from "jsonwebtoken"

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly JWT_SECRET: string

    constructor(
        private readonly configService: ConfigService
    ) {
        this.JWT_SECRET = this.configService.get<string>("JWT_SECRET")
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const { authorization } = request.headers
        if (authorization == null) return false

        const [prefix, token] = authorization.split(" ")
        if (prefix !== "Bearer") return false

        try {
            var decoded = verify(token, this.JWT_SECRET)
            request.jwt = decoded
            return true
        } catch (err) {
            return false
        }
    }
}