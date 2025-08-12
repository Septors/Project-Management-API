import { IsString,IsOptional } from "class-validator";

export class CreateAnswerDto {
    @IsString()
    title:string;
    @IsString()
    description:string;
    @IsOptional()
    @IsString()
    file:string;
    @IsString()
    userId:number;
    @IsString()
    taskId:number ;
}