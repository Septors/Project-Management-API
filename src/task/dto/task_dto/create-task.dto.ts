import { IsString,IsOptional, IsNumber,IsInt } from "class-validator";
import { Type } from "class-transformer";


export class CreateTaskDto{
    @IsString()
    title : string;
    @IsString()
    description:string;
    @IsOptional()
    @IsString()
    file :  string;
    @IsString()
    @IsOptional()
    status?: string;
    @IsNumber()
    @IsInt()
    @Type(()=>Number)
    projectId: number;
     @IsNumber()
  createrId: number;
    @IsOptional()
    @IsString()
    comments:[];
    @IsOptional()
    @IsString()
    answers:[];
    @IsString()
    assignedTask:[];

}