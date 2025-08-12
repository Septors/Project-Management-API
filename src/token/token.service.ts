import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


export interface TokenPayload {
    sub:number,
    role:string,
    email?:string,

}

@Injectable()
export class TokenService{
    constructor(private readonly jwtService: JwtService){}

    createToken(payload:TokenPayload):{accessToken:string,refreshToken:string}{
        const accessToken:string =  this.jwtService.sign(payload,
            {secret:process.env.ACCESS_SECRET,
            expiresIn:"1d"}
        )
        const refreshToken:string = this.jwtService.sign(payload,{
            secret:process.env.REFRESH_SECRET,
            expiresIn: "7d"
        })

        return {accessToken,refreshToken}
    }

    
    verifyToken(token:string):TokenPayload{
    return this.jwtService.verify<TokenPayload>(token,{secret:process.env.ACCESS_SECRET})
    }

    
    
}