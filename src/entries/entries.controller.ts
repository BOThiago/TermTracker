import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WordService } from '../word/word.service';
import { UsuarioIdParam } from '../helpers/params-decorators.helper';

@Controller('entries/en')
@UseGuards(JwtAuthGuard)
export class EntriesController {
  constructor(
    private readonly entriesService: EntriesService,
    private readonly wordService: WordService,
  ) {}

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.wordService.getWords(search, page, limit);
  }

  @Get(':word')
  async findOne(
    @Param('word') word: string,
    @UsuarioIdParam('userId') userId: string,
  ) {
    return this.entriesService.findOne(word, userId);
  }

  @Post(':word/favorite')
  async addFavorite(
    @Param('word') word: string,
    @UsuarioIdParam('userId') userId: string,
  ) {
    return await this.entriesService.addFavorite(word, userId);
  }

  @Delete(':word/unfavorite')
  async removeFavorite(
    @Param('word') word: string,
    @UsuarioIdParam('userId') userId: string,
  ) {
    return await this.entriesService.removeFavorite(word, userId);
  }
}
