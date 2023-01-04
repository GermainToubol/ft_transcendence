import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // handleRequest(err: any, user: any, info: any) {
    //     if (err || !user) {
	// 		console.log('no user');
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