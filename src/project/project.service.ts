import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ResponseProjectDto } from './dto/response-project.dto';
import { MemberDto } from './dto/member.dto';
import { ProjectRole } from '@prisma/client';
import { NotificationsGateway } from 'src/notification/notification.gateway';





@Injectable()
export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly notificationsGateway: NotificationsGateway,
    ){}

        async updateMemberList(dto: { member: MemberDto[] }, projectId: number): Promise<MemberDto[]> {
         return dto.member.map((m) => ({
         userId: m.userId,
         projectId,
         userRole: (m.userRole as ProjectRole) || ProjectRole.EXECUTOR,
  }));
}


        async createProject(dto:CreateProjectDto,createrId:number): Promise<ResponseProjectDto>{
            const newProject = await  this.projectRepository.createProject(dto,createrId);

            const memberList = await this.updateMemberList({member:dto.member ?? []},newProject.id);

            await this.projectRepository.addUsersToProject(memberList);

            const project = await this.projectRepository.getProject(newProject.id)
            console.log(newProject)
            console.log(project)

            if(!project){throw new InternalServerErrorException("Project not created or users not added ")}

            this.notificationsGateway.sendNotificationToUsers(memberList.map(member=>member.userId.toString()),project);

            return project;
        };

        async addUser(dto:{member:MemberDto[]},projectId:number):Promise<MemberDto[]>{
            const memberList = await this.updateMemberList(dto,projectId);
            console.log(memberList)
            if(!memberList){throw new InternalServerErrorException("Member list not created ")}
            this.notificationsGateway.sendNotificationToUsers(memberList.map(member=>member.userId.toString()),{message:"User has been added to project"});
            return await this.projectRepository.addUsersToProject(memberList);
        }

        async updateProject(dto:UpdateProjectDto,projectId):Promise<ResponseProjectDto>{
            const project = await this.projectRepository.updateProject(dto,projectId)
            if(!project){throw new InternalServerErrorException("Project was not updated")}
            const memberList = await this.projectRepository.getMemberListInProject(project.id)
            this.notificationsGateway.sendNotificationToUsers(memberList,project)
            return  project;
        }

        async changeUserRole(dto:ProjectRole,projectId:number,userId:number):Promise<{message:string}>{
            const userRole =await this.projectRepository.changeRole(dto,projectId,userId)
            if(!userRole){throw new InternalServerErrorException("Cannot change user role")}
            return {message:"User role has been change"}
        }

        async deleteProject(projectId:number):Promise<{message:string}>{
            const accessDelete =await this.projectRepository.delete(projectId)
            console.log({error:accessDelete})
            if(!accessDelete){throw new NotFoundException("Project not found or cant deleted")}
            return {message:`Project with id:${projectId} has been delted`}
        }

        async getProject(projectId:number,userId:number):Promise<ResponseProjectDto>{
            const userInProject = await this.projectRepository.checkUserInProject(projectId,userId)
            const userCreater  = await this.projectRepository.checkProjectCreater(userId,projectId)
            console.log(userCreater)
            if(!userInProject && !userCreater){throw new ForbiddenException("Access denied")}
            return await this.projectRepository.getProject(projectId)

        }

    }
