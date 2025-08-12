import { Exclude,Expose } from "class-transformer";

@Exclude()
export class UserDto{
    @Expose()
    email:string;
    @Expose()
    role:string;
} 