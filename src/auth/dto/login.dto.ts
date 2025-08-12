import { IsEmail,IsNotEmpty,IsString,Matches } from "class-validator";


export class LoginUserDto{     
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,{
       message:"Incorrect password."
     })  
     password:string;

}