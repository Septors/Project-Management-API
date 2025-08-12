import { Injectable,CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { error } from "console";
import { ProjectRepository } from "src/project/project.repository";


@Injectable()

export class CreaterGuard implements CanActivate{
    constructor(private readonly projectRepository : ProjectRepository){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const user = request.user.sub;
        const projectId = request.body.projectId?request.body.projectId:request.params.projectId;
        console.log(request)
        console.log(request.params.projectId)

        if(!user || !projectId){
           throw new ForbiddenException("Missing user or project ID")
        }

        const userCreater = await this.projectRepository.checkProjectCreater(user,parseInt(projectId));
        console.log(userCreater)

        if(!userCreater){throw new ForbiddenException("Access denide to this project")}

        return true;
    }

}