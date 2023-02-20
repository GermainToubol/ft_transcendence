import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserAdapter } from './chat/usersocket.adapter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
  app.useWebSocketAdapter(new UserAdapter(app));
  app.setGlobalPrefix('api');
    await app.listen(3000, "0.0.0.0");
}
bootstrap();
