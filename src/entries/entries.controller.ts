import { Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WordService } from '../word/word.service';
import {
  WordAndUserIdParam,
  searchParams,
} from '../helpers/params-decorators.helper';
import { searchParamsInterface } from '../helpers/interfaces/searchParams.interface';
import { WordAndUserIdInterface } from '../helpers/interfaces/wordAndUserId.interface';

@Controller('entries/en')
@UseGuards(JwtAuthGuard)
export class EntriesController {
  constructor(
    private readonly entriesService: EntriesService,
    private readonly wordService: WordService,
  ) {}

  @Get()
  async findAll(
    @searchParams() { search, page, limit }: searchParamsInterface,
  ) {
    return this.wordService.getWords(search, page, limit);
  }

  @Get(':word')
  async findOne(
    @WordAndUserIdParam() { word, userId }: WordAndUserIdInterface,
  ) {
    return this.entriesService.findOne(word, userId);
  }

  @Post(':word/favorite')
  async addFavorite(
    @WordAndUserIdParam() { word, userId }: WordAndUserIdInterface,
  ) {
    return await this.entriesService.addFavorite(word, userId);
  }

  @Delete(':word/unfavorite')
  async removeFavorite(
    @WordAndUserIdParam() { word, userId }: WordAndUserIdInterface,
  ) {
    return await this.entriesService.removeFavorite(word, userId);
  }
}
