import { 
    Body,
    Controller,
    Delete,
    Get,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    Param
     } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreaterGuard } from 'src/common/guards/project.creater.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ResponseProjectDto } from './dto/response-project.dto';
import { MemberDto } from './dto/member.dto';
import { ProjectRole } from '@prisma/client';


@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService){}
    
    @UseGuards(AuthGuard)
    @Get(":projectId")
    async getProject(
        @Param("projectId",ParseIntPipe) projectId: number,
        @GetUser("sub") sub:number,
):Promise<ResponseProjectDto>{
        return await this.projectService.getProject(projectId,sub)
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() dto:CreateProjectDto,
                @GetUser("sub") sub: number
):Promise<ResponseProjectDto>{
    return await this.projectService.createProject(dto,sub)
    }

    @UseGuards(AuthGuard,CreaterGuard)
    @Post(":projectId/users")
    async add(
        @Body() dto:{member:MemberDto[]},
        @Param("projectId",ParseIntPipe) projectId:number
):Promise<MemberDto[]>{
    console.log(projectId)
    return await this.projectService.addUser(dto,projectId)
}

    @UseGuards(AuthGuard,CreaterGuard)
    @Patch(":projectId")
    async update(
        @Body() dto:UpdateProjectDto,
        @Param("projectId",ParseIntPipe) projectId:number
    ):Promise<UpdateProjectDto>{
        return await this.projectService.updateProject(dto,projectId)
    }

    @UseGuards(AuthGuard,CreaterGuard)
    @Patch(":projectId/user/:userId")
    async changeRole(
        @Body() dto:ProjectRole,
        @Param("projectId",ParseIntPipe) projectId:number,
        @Param("userId",ParseIntPipe) userId:number):Promise<{message:string}>{
        return await this.projectService.changeUserRole(dto,projectId,userId)
    }

    @UseGuards(AuthGuard,CreaterGuard)
    @Delete(":projectId")
    async delete(@Param("projectId",ParseIntPipe) projectId: number):Promise<{message:string}>{
        console.log(projectId)
        return await this.projectService.deleteProject(projectId);
    }
}
