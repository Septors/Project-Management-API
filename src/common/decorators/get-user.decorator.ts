import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import type { Request as ExRequest,} from 'express-serve-static-core';

type Request = ExRequest; 


export const GetUser = createParamDecorator(
    (data: keyof Express.User | undefined,ctx: ExecutionContext):any  =>{
        const request = ctx.switchToHttp().getRequest<Request>();
        const user = request.user;
        return data? user?.[data] : user;
    },
);