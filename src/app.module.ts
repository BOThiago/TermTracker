import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DATABASE_HOST')}:${configService.get('DATABASE_PORT')}`,
        dbName: `${configService.get('DATABASE_NAME')}`,
        autoCreate: true,
        auth: {
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASS'),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    HttpModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
