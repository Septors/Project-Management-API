import { IsString,IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class MemberDto{
    @IsNotEmpty()
    @IsNumber()
    userId:number;

    @IsOptional()
    projectId?:number;

    @IsNotEmpty()
    @IsString()
    userRole:string
}