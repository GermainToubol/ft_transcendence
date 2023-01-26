import { IoAdapter } from "@nestjs/platform-socket.io";
import { Socket } from "socket.io";
import { User } from "src/users/user.entity";
import { verify } from "jsonwebtoken";
import { jwtConstants } from "src/auth/constants";

export interface UserSocket extends Socket {
    userLogin: string;
}

export class UserAdapter extends IoAdapter {

    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, { ...options });
        server.use((socket: UserSocket, next: any) => {
            if (socket.handshake.auth && socket.handshake.auth.accessToken) {
                verify(socket.handshake.auth.accessToken, jwtConstants.secret, (err: any, decoded: User | any) => {
                    if (err) {
                        next(new Error('Authentication error'));
                    } else {
                        socket.userLogin = decoded.login;
                        next();
                    }
                });
            } else {
                next(new Error('Authentication error'));
            }
        })
        return server;
    }
}
