import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dto/task_dto/create-task.dto";
import { plainToInstance } from "class-transformer";
import { ResponseTaskDto } from "./dto/task_dto/response-task.dto";
import { TaskDto } from "./dto/task_dto/task.dto";
import { AnswerToTask, AssignedTasks, Task } from "@prisma/client";
import { UpdateTaskDto } from './dto/task_dto/update-task.dto';
import { CreateAnswerDto } from "./dto/asnwers_dto/create-answers.dto";
import { UpdateAsnwersDto } from "./dto/asnwers_dto/update-answers.dto";

@Injectable()
export class TaskRepository{
    constructor(private readonly prisma: PrismaService){}
    
    async createTask(dto:CreateTaskDto,createrId:number,projectId:number,file? :string):Promise<ResponseTaskDto>{
        return await this.prisma.task.create({
            data:{
                   title : dto.title,
                    description:dto.description,
                    file :  file ||null,
                    status: dto.status || "CREATED",
                    projectId:projectId,
                    createrId:createrId,
                },
  
            include:{
                    comments:true,
                    answers:true,
                    assignedTasks:true,
  
                }
            
        })
        
    }

    async addUserToTask(dto:{userId:number},taskId:number,projectId:number):Promise<AssignedTasks | null >{
        return await this.prisma.assignedTasks.create({
            data:{
                userId:dto.userId,
                taskId:taskId,
                projectId:projectId
            }
        })
       
    }

    async getTasks(projectId:number):Promise<ResponseTaskDto[]>{
        return await this.prisma.task.findMany({
            where:{
                projectId,
            },
            include:{
                    comments:true,
                    answers:true,
                    assignedTasks:true,
  
                
            }
        })

    }
    
    async changeTask(dto:UpdateTaskDto,taskId:number,file? :string):Promise<ResponseTaskDto>{
       return await this.prisma.task.update({
            where:{id:taskId},
            data:{  title : dto.title,
                    description:dto.description,
                    file :  file ||null ,
                    status: dto.status,
            },
            include:{
                comments:true,
                answers:true,
                assignedTasks:true,
            }
        })
    }

    async deleteTask(taskId:number,projectId:number):Promise<Task>{
        return await this.prisma.task.delete({where:{
            id:taskId,
            projectId,
        }})
    }

    async deleteUserInTask(taskId:number,projectId:number,userId:number):Promise<AssignedTasks>{
        return  await this.prisma.assignedTasks.delete({
            where:{
                taskId_projectId_userId:{
                    userId:userId,
                    taskId:taskId,
                    projectId:projectId}
            }
        })
        
    }

    async createAnswer(dto:CreateAnswerDto,file? :string):Promise<AnswerToTask>{
        return await this.prisma.answerToTask.create({
            data:{
                userId:dto.userId,
                taskId:dto.taskId,
                title: dto.title,
            description:dto.description, 
            file:dto.file
        }
        })

    }

    async updateAnswer(dto:UpdateAsnwersDto,taskId:number,file? :string):Promise<AnswerToTask>{
        return await this.prisma.answerToTask.update({
            where:{id:taskId},
            data:{
                userId:dto.userId,
                taskId:dto.taskId,
                title: dto.title,
            description:dto.description, 
            file:dto.file
            }
        })
    } 

    async getTaskCreater(taskAnswerId:number):Promise<number>{
        const task = await this.prisma.answerToTask.findUnique({
            where:{
                id:taskAnswerId
            },
            include:{
                task:{
                    select:{
                        createrId:true
                    }
                }
            }
        })
        return task!.task.createrId;
    }

    async getTaskUsersId(taskId: number): Promise<number[]> {
    const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: {
            assignedTasks: {
                select: { userId: true }
            }
        }
    });

      return task?.assignedTasks
        .map(t => t.userId)
        .filter((id): id is number => id !== null) ?? [];
}

    async checkUserInTask(userId:number,taskId:number):Promise<any>{
        return await this.prisma.assignedTasks.findFirst({
            where:{
                userId,
                taskId,
            }
        })
    }


}