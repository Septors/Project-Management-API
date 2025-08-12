import { IsString,IsOptional,IsNumber,IsNotEmpty } from "class-validator";

export class CreateCommentDto{
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsNumber()
    parentId?: number;

    @IsNotEmpty()
    @IsNumber()
    taskId:number;

    @IsNotEmpty()
    @IsNumber()
    authorId:number;

    @IsOptional()
    @IsNumber()
    targetId?:number
}