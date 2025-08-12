import { Controller,Get,Post,Body,Res,Req,UseGuards,HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { ResponseAuthPayloadDto } from './dto/response.auth.dto';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { Request as ExRequest, Response as ExResponse } from 'express-serve-static-core';
import { UserDto } from './dto/user.dto';


type Request = ExRequest; 
type Response = ExResponse;

@Controller('auth')
export class AuthController {
    constructor( private readonly authService : AuthService){}

    @UseGuards(AuthGuard)
    @Get()
    async getMe(@GetUser("sub") sub:number):Promise<UserDto>{
        return await this.authService.getProfile(sub)

    }

    @Post("login")
    @HttpCode(200)
    async login(
        @Body() dto:LoginUserDto,
        @Res({passthrough:true}) res:Response,
    ):Promise<ResponseAuthPayloadDto>{
        const user = await this.authService.login(dto);

        res.cookie("refreshToken",user.refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"lax",
            maxAge:7*24*60*60*1000,
            path:'/',
        })

        return{
            user:user.user,
            accessToken:user.accessToken,
        }

    } 

    @Post("register")
    async register(
        @Body() dto:RegisterUserDto,
        @Res({passthrough: true}) res :Response
):Promise<ResponseAuthPayloadDto>{

        const result = await  this.authService.register(dto);

        res.cookie("refreshToken",result.refreshToken,{
            httpOnly:true,
            secure: true,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000,
            path:"/"
        } )

        return {
            user:result.user,
            accessToken:result.accessToken
        }
    }

    @UseGuards(AuthGuard)
    @Post("logout")
    @HttpCode(200)
    async logout(
        @GetUser('sub') sub: number, 
        @Res({passthrough: true}) res: Response,
        @Req() req:Request
    ):Promise<{message:string}>{
        res.clearCookie("refreshToken")
        const token = req.headers["authorization"]!.split(' ')[1];
        return await this.authService.logout(sub,token)

    }


   @UseGuards(AuthGuard)
    @Post("update-token")
    @HttpCode(200)
    async refresh(
        @GetUser("sub") sub: number,
        @Req() req:Request
    ){
        try {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = req.headers["authorization"]!.split(' ')[1];
    return await this.authService.refresh(sub, refreshToken,accessToken);
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
    }

  
}
