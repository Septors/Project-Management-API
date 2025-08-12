import { Exclude, Expose } from "class-transformer";
import { IsOptional, } from "class-validator";
import { UserDto } from "src/auth/dto/user.dto";
import { TaskDto } from "src/task/dto/task_dto/task.dto";

@Exclude()
export class ResponseProjectDto{
    @Expose()
    id:number;
    @Expose()
    name :string;
    @Expose()
    description :string;
    @Expose()  
    status:string;
    @Expose()  
    user:UserDto;
    @Expose()  
    @IsOptional()
    tasks:TaskDto[];
    @Expose()
    @IsOptional()
    projectUser: UserDto[];
}