import { CanActivate,Injectable,ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { TokenService } from "src/token/token.service";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly  tokenService: TokenService,
        private readonly redis:RedisService,
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.headers["authorization"]?.split(' ')[1];
        const user = await this.tokenService.verifyToken(accessToken);

        const isBlackListed = await this.redis.exists(`blacklist:${accessToken}`)
        if(isBlackListed){throw new UnauthorizedException("Token is revoked")}

        request.user = {
            sub:user.sub,
            role:user.role,
            email:user.email,
        };

        return true;
    }
}