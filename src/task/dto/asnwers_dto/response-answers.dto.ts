import { Expose,Exclude } from "class-transformer";
import { IsOptional } from "class-validator";

@Exclude()
export class ResponseAsnwersDto{
    @Expose()
    title:string;
    @Expose()
    description:string;
    @IsOptional()
    @Expose()
    file:string;
    
}