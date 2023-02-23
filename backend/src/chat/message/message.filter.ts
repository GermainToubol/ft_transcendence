import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class MessageExceptionFilter extends BaseWsExceptionFilter {
  constructor(private message: string) {
    super();
  }

  catch(exception: BadRequestException, host: ArgumentsHost) {
    host.getArgs()[0].emit("badMessage", this.message)
  }
}
