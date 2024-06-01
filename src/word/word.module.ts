import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordSchema } from './schema/words.schema';
import { WordService } from './word.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { WordController } from './word.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
    HttpModule,
    UserModule,
  ],
  controllers: [WordController],
  providers: [WordService],
  exports: [WordService, MongooseModule],
})
export class WordModule {}
