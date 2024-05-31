import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { WordModule } from '../word/word.module';

@Module({
  imports: [HttpModule, UserModule, WordModule],
  controllers: [EntriesController],
  providers: [EntriesService],
  exports: [EntriesService],
})
export class EntriesModule {}
