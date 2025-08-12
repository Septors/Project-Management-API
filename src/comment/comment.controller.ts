import { 
    Controller,
    Get, 
    Param,
    ParseIntPipe,
    Post,
    Body, 
    Patch,
    Delete,
    UploadedFile,
    UseInterceptors,
    UseGuards
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-ceomment.dto';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { multerConfig } from 'src/upload/upload.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { GetUser } from 'src/common/decorators/get-user.decorator';



@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService){}
    
    @UseGuards(AuthGuard) 
    @Get("tasks/:taskId")
    @UseInterceptors(FileInterceptor("file",multerConfig))
    async getComments(
        @Param("taskId",ParseIntPipe) taskId:number,
        @GetUser("sub") sub :number
):Promise<{ commentsList: ResponseCommentDto; fileUrl: string | null }[]>{
        return await this.commentService.getComments(taskId,sub)
    }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor("file",multerConfig))
    async createComment(
        @Body() dto:CreateCommentDto,
        @UploadedFile() file: Express.Multer.File,
        @GetUser("sub") sub :number
    ):Promise<{comment:ResponseCommentDto,fileUrl:string | null}>{
        return await  this.commentService.createComment(dto,sub,file?.path)
    }

    @UseGuards(AuthGuard)
    @Patch(":commentId")
    @UseInterceptors(FileInterceptor("file",multerConfig))
    async changeComment(
        @Param("commentId",ParseIntPipe) commentId: number,
        @Body() dto: UpdateCommentDto,
        @UploadedFile() file: Express.Multer.File,
        @GetUser('sub') sub:number
    ):Promise<{comment:ResponseCommentDto,fileUrl:string | null}>{
            return await this.commentService.changeComment(dto,commentId,sub,file?.path)
    }

    @UseGuards(AuthGuard)
    @Delete(":commentId")
    async deleteComment(
        @Param("commentId",ParseIntPipe) commentId: number,
        @GetUser('sub') sub:number
    ):Promise<{message:string}>{
        return await this.commentService.deleteComment(commentId,sub)

    }
}
