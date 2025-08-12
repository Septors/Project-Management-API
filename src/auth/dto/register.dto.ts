import { IsEmail,IsNotEmpty,IsString,Matches } from "class-validator";
import { Match } from "src/common/validators/password-match.validators";

export class RegisterUserDto{     
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @IsString()
     @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,{
       message:"Password must contain uppercase,lowercase and number."
     })  
     password:string;

    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword:string;
}