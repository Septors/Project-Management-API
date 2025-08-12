import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";
import { UserRole } from "@prisma/client";


@Injectable()
export class UserRepository{
    constructor( 
        private readonly prisma: PrismaService,

    ){}

    async findByEmail(email:string):Promise<User |null>{
        return await this.prisma.user.findUnique({
            where:{email:email},
        })
    }

    async findById(id:number):Promise<User | null >{
        return await this.prisma.user.findUnique({
            where:{id}
        })
    }

    async createUser(data:any,hashPassword:string,userRole:UserRole = UserRole.USER):Promise<User | null>{
        return await this.prisma.user.create({
            data:{
                email:data.email,
                password:hashPassword,
                role:userRole
            }
        })
    }
    async updateRefreshToken(id:number,token:string):Promise<User | null>{
        return await this.prisma.user.update({
            where:{id},
            data:{
                currentRefreshToken:token
            }
        })
    }
    async getUserProfile(id:number):Promise<User | null>{
        return await this.prisma.user.findUnique({
            where:{
                id,
            }
        })

    }

    async clearRefreshToken(id:number):Promise<User | null >{
        return await this.prisma.user.update({
            where:{id},
            data:{
                currentRefreshToken:null,
            }
        })

    }

 
}