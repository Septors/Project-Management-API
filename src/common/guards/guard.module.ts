import { forwardRef, Module } from "@nestjs/common";
import { AuthGuard } from "./auth.guards";
import { RolesGuard } from "./role.guards";
import { CreaterGuard } from "./project.creater.guard";
import { TokenModule } from "src/token/token.module";
import { ProjectModule } from "src/project/project.module";
import { RedisModule } from "src/redis/redis.module";


@Module({
    providers:[AuthGuard,RolesGuard,CreaterGuard],
    exports:[AuthGuard,RolesGuard,CreaterGuard],
    imports:[TokenModule,forwardRef(() => ProjectModule),RedisModule]
})

export class GuardModlue {}