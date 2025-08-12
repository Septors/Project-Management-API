import { ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-ceomment.dto';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { plainToInstance } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common';
import { NotificationsGateway } from 'src/notification/notification.gateway';
import { TaskRepository } from 'src/task/task.repository';


@Injectable()
export class CommentService {
    constructor(private readonly commentRepository:CommentRepository,
        private readonly notificationsGateway:NotificationsGateway,
        private readonly taskRepository: TaskRepository,
    ){}
    async createComment(dto:CreateCommentDto,userId:number,filePath?: string):Promise<{comment:ResponseCommentDto,fileUrl:string | null}>{
        const checkUserInTask = await this.taskRepository.checkUserInTask(userId,dto.taskId)
  if(!checkUserInTask){throw new ForbiddenException("Access denied")}
      
      
      const comment = await this.commentRepository.createComment(dto,filePath)
        
         if(!comment){throw new InternalServerErrorException(`Comment was not created`)}

        const usersId = await this.taskRepository.getTaskUsersId(comment.taskId)

        this.notificationsGateway.sendNotificationToUsers(usersId.map(id => id.toString()),comment)

        return{ comment:plainToInstance(ResponseCommentDto,comment,{
            excludeExtraneousValues:true
        }),
        fileUrl: comment.file
        ? `${process.env.APP_URL || 'http://localhost:3000'}/${comment.file}`
        : null,
    }
    }

    async changeComment(dto:UpdateCommentDto,commentId:number,userId:number,filePath?: string):Promise<{comment:ResponseCommentDto,fileUrl:string | null}>{
       const checkCommentCreater = await this.commentRepository.checkCommentCreater(userId,commentId)
  if(!checkCommentCreater){throw new ForbiddenException("Access denied")}  
      
      const comment = await this.commentRepository.chnageComment(dto,commentId,filePath)

        if(!comment){throw new InternalServerErrorException(`Comment was not created`)}

         return{ comment:plainToInstance(ResponseCommentDto,comment,{
            excludeExtraneousValues:true
        }),
        fileUrl: comment.file
        ? `${process.env.APP_URL || 'http://localhost:3000'}/${comment.file}`
        : null,
    }
    }

    async getComments(
  taskId: number,
  userId:number
): Promise<{ commentsList: ResponseCommentDto; fileUrl: string | null }[]> {
  const checkUserInTask = await this.taskRepository.checkUserInTask(userId,taskId)
  if(!checkUserInTask){throw new ForbiddenException("Access denied")}

  const comments = await this.commentRepository.getComments(taskId);

  if (!comments || comments.length === 0) {
    throw new NotFoundException(
      `Task with id:${taskId} not found or hasn't comments`
    );
  }

  return comments.map((comment) => ({
    commentsList: plainToInstance(ResponseCommentDto, comment, {
      excludeExtraneousValues: true,
    }),
    fileUrl: comment.file
      ? `${process.env.APP_URL || 'http://localhost:3000'}/${comment.file}`
      : null,
  }));
}


    async deleteComment(commentId:number,userId:number):Promise<{message:string}>{
        const checkCommentCreater = await this.commentRepository.checkCommentCreater(userId,commentId)
  if(!checkCommentCreater){throw new ForbiddenException("Access denied")}  

        const  comment = await this.commentRepository.deleteComment(commentId)

        if(!comment){throw new NotFoundException(`Comment with id:${commentId} not found `)}

        return{message:"Comment deleted"}
    }
}
