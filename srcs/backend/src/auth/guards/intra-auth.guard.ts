import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('intra') {
	handleRequest(err: any, user: any, info: any) {
		if (err || !user) {
			return null;
		}
		return user;
  }
}