import { 
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber, 
    IsArray,
     ValidateNested, } from "class-validator";
import { MemberDto } from "./member.dto";
import { Type } from "class-transformer";

export class CreateProjectDto{
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string
      
    @IsOptional()
    @IsString()
    status:string

   @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MemberDto)
    member?: MemberDto[];
      
}