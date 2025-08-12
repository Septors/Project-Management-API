import { ForbiddenException, Injectable,InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/task_dto/create-task.dto';
import { ResponseTaskDto } from './dto/task_dto/response-task.dto';
import { UpdateTaskDto } from './dto/task_dto/update-task.dto';
import { CreateAnswerDto } from './dto/asnwers_dto/create-answers.dto';
import { ResponseAsnwersDto } from './dto/asnwers_dto/response-answers.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateAsnwersDto } from './dto/asnwers_dto/update-answers.dto';
import { NotificationsGateway } from 'src/notification/notification.gateway';
import { ProjectRepository } from 'src/project/project.repository';



@Injectable()
export class TaskService {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly notificationGateway: NotificationsGateway,
        private readonly projectRepository:ProjectRepository,
    ){}
    
    async createTask(dto:CreateTaskDto,createrId:number,projectId:number,file?:string):Promise<{task:ResponseTaskDto,file:string |null}>{
        const task = await this.taskRepository.createTask(dto,createrId,projectId,file)
         if(!task){throw new InternalServerErrorException("Task not created")}
         return {task:plainToInstance(ResponseTaskDto,task,{
            excludeExtraneousValues:true
         }),
         file:task.file ? `${process.env.APP_URL} || http://localhost:3000`:null
        }
            
         
    }

    async changeTask(dto:UpdateTaskDto,taskId:number,file:string):Promise<{task:ResponseTaskDto,file:string |null}>{
        const task = await this.taskRepository.changeTask(dto,taskId,file)
        if(!task){throw new InternalServerErrorException("Task not changed")}
          return {task:plainToInstance(ResponseTaskDto,task,{
            excludeExtraneousValues:true
         }),
         file:task.file ? `${process.env.APP_URL} || http://localhost:3000`:null
        }
    }

    async addUserToTask(dto:{userId:number},taskId:number,projectId:number):Promise<{message:string}>{
        const assigned = await this.taskRepository.addUserToTask(dto,taskId,projectId)
         if(!assigned){throw new NotFoundException("User dont added to project")}
         this.notificationGateway.sendNotification(assigned.userId!.toString(),{Message:"You have new Task"})
         return {message:"User has been added to project"}
    }

    async deleteUserInTask(taskId:number,projectId:number,userId:number):Promise<{message:string}>{
        const deletedUser =await this.taskRepository.deleteUserInTask(taskId,projectId,userId)
        if(!deletedUser){throw new NotFoundException("User dont delete")}
        return {message:"User deleted"}
        
    }

    async deleteTask(taskId:number,projectId:number):Promise<{message:string}>{
        const deletedTask =await this.taskRepository.deleteTask(taskId,projectId)
        if(!deletedTask){throw new NotFoundException("Task not deleted")}
        return {message:"Task deleted"}
    }

    async getTasks(projectId:number,userId:number):Promise<{task:ResponseTaskDto,file:string |null}[]>{
        const checkUserInProject = await this.projectRepository.checkUserInProject(userId,projectId)
        if(!checkUserInProject){throw new ForbiddenException("Access denied")}

        const tasks = await this.taskRepository.getTasks(projectId)
        
        if(!tasks){throw new NotFoundException("Tasks not founded")}

        return tasks.map((task) => ({task:plainToInstance(ResponseTaskDto,task,{
            excludeExtraneousValues:true
        }),
        file:task.file ? `${process.env.APP_URL} || http://localhost:3000`:null
    }))

    }

    async createAnswer(dto:CreateAnswerDto,file?:string):Promise<{answer:ResponseAsnwersDto,file:string |null}>{
        const checkUserInTask = await this.taskRepository.checkUserInTask(dto.userId,dto.taskId)
        if(!checkUserInTask){throw new ForbiddenException("Access denied")};
        
        const newAnswer = await this.taskRepository.createAnswer(dto,file)
        if(!newAnswer){throw new NotFoundException("Answer not created")}
         const createrTask = await this.taskRepository.getTaskCreater(newAnswer.id)
        await this.notificationGateway.sendNotification(createrTask.toString(),{message:`new answer in task:${newAnswer.taskId}`})
        return {answer:plainToInstance(ResponseAsnwersDto,newAnswer,{
            excludeExtraneousValues:true
        }),
        file:newAnswer.file ? `${process.env.APP_URL} || http://localhost:3000`:null
    }
    }

    async changeAnswer(dto:UpdateAsnwersDto,taskId:number,userId:number,file?:string):Promise<{answer:ResponseAsnwersDto,file:string |null}>{
         const checkUserInTask = await this.taskRepository.checkUserInTask(userId,taskId)
        if(!checkUserInTask){throw new ForbiddenException("Access denied")};
                
        const newAnswer =await  this.taskRepository.updateAnswer(dto,taskId,file)
        if(!newAnswer){throw new NotFoundException("Answer not created")}
        return {answer:plainToInstance(ResponseAsnwersDto,newAnswer,{
            excludeExtraneousValues:true
        }),
        file:newAnswer.file ? `${process.env.APP_URL} || http://localhost:3000`:null
    }

}
}
