import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseProjectDto } from "./dto/response-project.dto";
import { plainToInstance } from "class-transformer";
import { CreateProjectDto } from "./dto/create-project.dto";
import { MemberDto } from "./dto/member.dto";
import { ProjectRole, ProjectUser } from "@prisma/client";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectRepository{
    constructor(private readonly prisma: PrismaService){}

    async createProject(dto:CreateProjectDto,createrId: number):Promise<ResponseProjectDto>{
         const project =  await this.prisma.project.create({
            data:{
                name:dto.name       , 
                description:dto.description,
                status:dto.status || "CREATED",
                createrId,
            },
            include:{
                projectUser:true,
                tasks:true,
                user:true,
            }
        })
        return plainToInstance(ResponseProjectDto,project,{
            excludeExtraneousValues:true
        })
    };

async addUsersToProject(memberList: MemberDto[]): Promise<MemberDto[]> {
  const insertedMembers = await Promise.all(
    memberList.map(member =>
      this.prisma.projectUser.create({
        data: {
          userId: member.userId,
          projectId: (member as any).projectId, 
          userRole: (member.userRole as ProjectRole) || ProjectRole.EXECUTOR,
        },
      })
    )
  );

  return insertedMembers;
}


        async checkProjectCreater(userId:number,projectId:number):Promise<any>{
            return await this.prisma.project.findFirst({
                where:{
                    id:projectId,
                    createrId:userId
                },

            })
            
        }

        async updateProject(dto:UpdateProjectDto,projectId:number):Promise<ResponseProjectDto>{
            const project = await this.prisma.project.update({
                where:{
                    id:projectId
                },
                data:{
                    ...dto
                },
                include:{
                    user:true,
                    tasks:true,
                    projectUser:true

            }
            })
            return plainToInstance(ResponseProjectDto,project,{
                excludeExtraneousValues:true
            })
        }

        async changeRole(dto:ProjectRole,projectId:number,userId:number):Promise<MemberDto>{
            return await this.prisma.projectUser.update({
                where:{
                    userId_projectId:{
                        userId:userId,
                        projectId:projectId
                    },
                },
                data:{
                    userRole:dto,
                }
            })
        }

        async delete(projectId:number):Promise<any>{
            return await this.prisma.project.delete({
                where:{
                    id:projectId
                }
            })
        }

        async getProject(id:number):Promise<ResponseProjectDto>{
            const project = await this.prisma.project.findUnique({
                where:{
                    id,
                },
                include:{
                    projectUser: {
      select: {  
        userRole: true,
        user: {
          select: {
            email: true,
          }
        }
      }
    },
    tasks: true,
    user: {
      select: {
        email: true,
        role: true,
        id: true,
      }
    }
  }
            });
            return plainToInstance(ResponseProjectDto,project,{
                excludeExtraneousValues:true,
            })
        }

        async getMemberListInProject(projectId:number):Promise<string[]>{
            const users = await this.prisma.project.findMany({
                where:{id:projectId},
                include:{
                    user:{
                        select:{
                            id:true
                        }
                    }
                }

            })
            return users.map(user => user.user!.id.toString())
        }

        async checkUserInProject(userId:number,projectId:number):Promise<ProjectUser | null>{
            return await this.prisma.projectUser.findFirst({
                where:{
                    userId,
                    projectId
                }
            })
        }
    };

    
