import { Expose,Exclude } from "class-transformer";
import { IsOptional } from "class-validator";

@Exclude()
export class ResponseTaskDto{
    @Expose()
    id:number;
    @Expose()
    title : string;
    @Expose()
    description:string;
    @IsOptional()
    @Expose()
    file :  string | null;
    @Expose()
    status: string;
    @Expose()
    @IsOptional()
    comments:any[];
    @IsOptional()
    @Expose()
    answers:any[];
    @Expose()
    assignedTasks:any[];


}