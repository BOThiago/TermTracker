import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const PORT = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Term-Tracker-API')
    .setDescription('The Term-Tracker API description')
    .setVersion('1.0')
    .addTag('Challenge')
    .addTag('Auth')
    .addTag('User')
    .addTag('Word')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(PORT, '0.0.0.0', async () =>
    console.log(`🚀 Application is running on: ${await app.getUrl()}`),
  );
}
bootstrap();
