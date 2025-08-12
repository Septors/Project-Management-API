import { 
    Controller,
    Post,
    Body,
    Get,
    Delete,
    Patch,
    Param,
    ParseIntPipe,
    UploadedFile,
    UseInterceptors,
    UseGuards
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task_dto/create-task.dto';
import { ResponseTaskDto } from './dto/task_dto/response-task.dto';
import { UpdateTaskDto } from './dto/task_dto/update-task.dto';
import { CreateAnswerDto } from './dto/asnwers_dto/create-answers.dto';
import { ResponseAsnwersDto } from './dto/asnwers_dto/response-answers.dto';
import { UpdateAsnwersDto } from './dto/asnwers_dto/update-answers.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/upload/upload.config';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { CreaterGuard } from 'src/common/guards/project.creater.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';


@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService){}

    @UseGuards(AuthGuard)
    @Post("projects/:projectId")
    @UseInterceptors(FileInterceptor("file",multerConfig))
    async createTask(
        @Body() dto:CreateTaskDto,
        @UploadedFile() file: Express.Multer.File,
        @GetUser("sub")sub:number,
        @Param("projectId",ParseIntPipe) projectId :number
    ):Promise<{task:ResponseTaskDto,file:string |null}>{
        return await  this.taskService.createTask(dto,sub,projectId,file?.path)
    }

    @UseGuards(AuthGuard)
    @Get("projects/:projectId")
    async getTasks(
        @Param("projectId",ParseIntPipe) projectId:number,
        @GetUser("sub") sub:number,
    
    ):Promise<{task:ResponseTaskDto,file:string |null}[]>{
        return await this.taskService.getTasks(projectId,sub)
    }

    @UseGuards(AuthGuard,CreaterGuard)
    @Post(":taskId/projects/:projectId/users")
    async addUser( 
        @Body() dto:{userId:number},
        @Param("taskId",ParseIntPipe) taskId: number,
        @Param("projectId",ParseIntPipe) projectId: number              
):Promise<{message:string}>{
        return await this.taskService.addUserToTask(dto,taskId,projectId)

    }

    @UseGuards(AuthGuard,CreaterGuard)
    @UseInterceptors(FileInterceptor("file",multerConfig))
    @Patch(":taskId/projects/:projectId")
    async changeTask(
        @Body() dto:UpdateTaskDto,
        @Param("taskId",ParseIntPipe) taskId:number,
        @UploadedFile() file: Express.Multer.File            
):Promise<{task:ResponseTaskDto,file:string |null}>{
        return await this.taskService.changeTask(dto,taskId,file?.path)
    }

    @UseGuards(AuthGuard,CreaterGuard)
    @Delete(":taskId/projects/:projectId/users/:userId")
    async deleteUser(
        @Param("taskId",ParseIntPipe) taskId:number,
        @Param("projectId",ParseIntPipe) projectId:number,
        @Param("userId",ParseIntPipe) userId:number,
    ):Promise<{message:string}>{
         return await this.taskService.deleteUserInTask(taskId,projectId,userId)
    }

    @UseGuards(AuthGuard,CreaterGuard)
    @Delete(":taskId/projects/:projectId")
    async deleteTask(
        @Param("taskId",ParseIntPipe) taskId:number,
        @Param("projectId",ParseIntPipe) projectId:number,
    
    ):Promise<{message:string}>{
        return await this.taskService.deleteTask(taskId,projectId)
    }

    @UseGuards(AuthGuard)
    @Post("answers")
    @UseInterceptors(FileInterceptor("file",multerConfig))
    async createAnswer(
        @Body() dto:CreateAnswerDto,
        @UploadedFile() file: Express.Multer.File
    ):Promise<{answer:ResponseAsnwersDto,file:string |null}>{
        return await this.taskService.createAnswer(dto,file?.path)
    }

    @UseGuards(AuthGuard)
    @Patch(":taskId/answers")
    @UseInterceptors(FileInterceptor("file",multerConfig))
    async changeAnswer(
        @Body() dto:UpdateAsnwersDto,
        @Param("taskId",ParseIntPipe) taskId:number,
        @UploadedFile() file: Express.Multer.File,
        @GetUser("sub") sub:number,
    ):Promise<{answer:ResponseAsnwersDto,file:string |null}>{
        return await this.taskService.changeAnswer(dto,taskId,sub,file?.path) 
    }

}
