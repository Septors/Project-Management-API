import { TokenPayload } from "src/token/token.service";
import "express"

declare global {
    namespace Express{
        interface User extends TokenPayload{}
    }
}