import { WebSocketGateway,WebSocketServer,OnGatewayConnection,OnGatewayDisconnect } from "@nestjs/websockets";
import {Server,Socket} from "socket.io"

WebSocketGateway({
    cors:{
        origin: "*"
    },
    namespace:"/notifications",
})
export class NotificationsGateway implements OnGatewayConnection,OnGatewayDisconnect{
    @WebSocketServer()
    server:Server;

    private clients = new Map<string,string>();

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string
    
        if(!userId){
            client.disconnect(true);
            return
        }

        this.clients.set(userId,client.id);
        console.log(`User ${userId} connected ${client.id}`)
    }

    handleDisconnect(client: Socket) {
        for(const [userId,socketId] of this.clients.entries()){
            if(socketId === client.id){
                this.clients.delete(userId);
                console.log(`User ${userId} disconnected`)
                break;
            }
        }
    }

    sendNotification(userId:string,payload:any){
        const socketId = this.clients.get(userId);
        if(socketId){
            this.server.to(socketId).emit("notification",payload)
        }
    }


    sendNotificationToUsers(userIds:string[],payload:any){
        userIds.forEach(userId => {
            this.sendNotification(userId,payload)
        });
}
}