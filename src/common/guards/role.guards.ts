import { CanActivate,ExecutionContext,Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorators";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRole = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
        [
            context.getHandler(),
            context.getClass(),
        ],
    );

    if(!requiredRole || requiredRole.length === 0){
        return true;
    }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requiredRole.includes(user.role)
    }
}