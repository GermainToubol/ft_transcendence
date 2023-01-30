import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // handleRequest(err: any, user: any, info: any) {
    //     if (err || !user) {
    //         return null;
    //     }
    //     return user;
    // }
}

@Injectable()
export class JwtAuthGuardWs extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const wsctx = context.switchToWs().getClient();
        console.log("a")
        return {
            headers: wsctx.handshake.headers,
        }
    }

    // handleRequest(err: any, user: any, info: any) {
    //     if (err || !user) {
    //         return null;
    //     }
    //     return user;
    // }
}

@Injectable()
export class JwtLoginAuthGuard extends AuthGuard('jwtlogin') {
    // handleRequest(err: any, user: any, info: any) {
    //     if (err || !user) {
    // 		console.log('no usreergrrgrger');
    //         return null;
    //     }
    //     return user;
    // }
}
