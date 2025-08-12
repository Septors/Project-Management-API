import { Expose,Exclude } from "class-transformer";
import { UserDto } from "./user.dto";
import { Pick } from "@prisma/client/runtime/library";

@Exclude()
export class ResponseUserDto{
    @Expose()
    user: UserDto;
    @Expose()
    accessToken:string;
    @Expose()
    refreshToken:string;
}   

export type ResponseAuthPayloadDto = Pick<ResponseUserDto, "user" |  "accessToken">