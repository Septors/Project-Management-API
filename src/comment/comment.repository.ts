import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-ceomment.dto";
import { ResponseCommentDto } from "./dto/response-comment.dto";


@Injectable()
export class CommentRepository{
    constructor(private readonly prisma: PrismaService){}
   
    async createComment(dto:CreateCommentDto,filePath?: string):Promise<ResponseCommentDto>{
        return await this.prisma.comment.create({
            data:{
                title:dto.title,
                description:dto.description,
                file:filePath ?? null,
                parentId:dto.parentId,
                taskId:dto.taskId,
                targetId:dto.targetId,
                authorId:dto.authorId

            },
            include:{
                author:{
                    select:{
                    id:true,
                    email:true}
                },
                target:{
                    select:{
                        id:true,
                        email:true
                    }
                }
            }
        }
    )
  
}

    async chnageComment(dto:UpdateCommentDto,id:number,filePath?: string):Promise<ResponseCommentDto>{
        return await this.prisma.comment.update({
            where:{
                id,
            },
            data:{
                ...dto,
                   file:filePath ?? null,
            },
            include:{
                author:{
                    select:{
                    id:true,
                    email:true}
                },
                target:{
                    select:{
                        id:true,
                        email:true
                    }
                }
            }
        }
    )

}

    async getComments(taskId:number):Promise<ResponseCommentDto[]>{
        return await this.prisma.comment.findMany({
            where:{taskId},
            include:{
                author:{select:{
                    id:true,
                    email:true
                }},
                target:{
                    select:{
                        id:true,
                        email:true
                    }
                }
            }
        })
    }
    async deleteComment(id:number):Promise<{message:string}>{
        await this.prisma.comment.delete({
            where:{id}
        })
        return{message:"Comment delete succesfully"}
    }

    async checkCommentCreater(userId:number,commentId:number):Promise<any>{
        return await this.prisma.comment.findMany({
            where:{id:commentId,
                authorId:userId
            }
        })
    }
}
