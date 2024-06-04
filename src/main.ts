import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const PORT = process.env.PORT || 3000;

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(PORT, '0.0.0.0', async () =>
    console.log(`🚀 Application is running on: ${await app.getUrl()}`),
  );
}
bootstrap();
