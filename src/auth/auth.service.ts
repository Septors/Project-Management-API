import { Injectable,HttpStatus,HttpException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException, BadRequestException  } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { ResponseUserDto } from './dto/response.auth.dto';
import { UserRepository } from 'src/user/user.repository';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { RedisService } from 'src/redis/redis.service';




@Injectable()
export class AuthService {
    constructor( 
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly redisService: RedisService 
){}

        async register(dto:RegisterUserDto): Promise<ResponseUserDto>{
            const emailExist = await this.userRepository.findByEmail(dto.email)

            if(emailExist){ throw new ConflictException('Email already exists');}

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(dto.password,salt)

            const userEntity = await this.userRepository.createUser(dto,hash)

            if(!userEntity){throw new InternalServerErrorException("User not crested")}

            const {accessToken,refreshToken} =  this.tokenService.createToken({sub:userEntity.id,role:userEntity.role})
    
            this.userRepository.updateRefreshToken(userEntity.id,refreshToken)

            const user = plainToInstance(UserDto,userEntity,{
                excludeExtraneousValues:true,
            })

            return{
                user,
                accessToken,
                refreshToken
            }

            
        }

        async login(dto:LoginUserDto):Promise<ResponseUserDto>{
            const user = await this.userRepository.findByEmail(dto.email)

            if(!user){throw new  NotFoundException("User not found")}

        const match = await bcrypt.compare(dto.password,user.password) 

        if(!match){throw new BadRequestException("Incorrect password")}

        const{accessToken,refreshToken} =  this.tokenService.createToken({sub:user.id,role:user.role})
        
        await this.userRepository.updateRefreshToken(user.id,refreshToken)

        return{
            user:plainToInstance(UserDto,user,{excludeExtraneousValues:true}),
            accessToken:accessToken,
            refreshToken:refreshToken
        }
        }

        async getProfile(id:number):Promise<UserDto>{
            const user = await  this.userRepository.getUserProfile(id)
            if(!user){throw new NotFoundException("User not found")}
            return plainToInstance(UserDto,user,{
                excludeExtraneousValues:true
            })
        }

        async logout(userId:number,accessToken:string):Promise< {message:string}>{
            const logout = await this.userRepository.clearRefreshToken(userId)
            await this.redisService.set(`blacklist:${accessToken}`,"true",15*60)
            if(!logout){throw new InternalServerErrorException("User not exit")}
            return {message:"User exist succesfulley"}
        }

        async refresh(id:number,currentRefreshToken:string,currentAccessToken:string):Promise<{accessToken:string}>{
            const user = await this.userRepository.findById(id);

            if(!user){throw new NotFoundException(`User not found`)}

            await this.redisService.set(`blacklist:${currentAccessToken}`,"true",15*60)

            if(user.currentRefreshToken != currentRefreshToken){throw new UnauthorizedException("Incorrect refresh token")}

            const {accessToken,refreshToken} =  this.tokenService.createToken({sub:user.id,role:user.role})

            return {accessToken};
        }
}
