import { Expose,Exclude } from "class-transformer";

@Exclude()
export class ResponseCommentDto{

        @Expose()
        title: string;

        @Expose()
        description: string;

        @Expose()
        file?:string | null;
        
        taskId:number;
        
        @Expose()
        createdAt:Date;

        @Expose()
        author:{
            id:number,
            email:string
        };

        @Expose()
        target?:{
            id:number,
            email:string
        } | null;
    
    
}