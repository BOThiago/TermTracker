import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordSchema } from './schema/words.schema';
import { WordService } from './word.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
    HttpModule,
  ],
  providers: [WordService],
  exports: [WordService, MongooseModule],
})
export class WordModule {}
