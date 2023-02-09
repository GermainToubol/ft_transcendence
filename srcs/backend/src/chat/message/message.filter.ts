import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class MessageExceptionFilter extends BaseWsExceptionFilter {
  constructor(private message: string) {
    super();
  }

  catch(exception: BadRequestException, host: ArgumentsHost) {
    console.log(`Invalid message from ${host.getArgs()[0].id}`)
    host.getArgs()[0].emit("badMessage", this.message)
  }
}
