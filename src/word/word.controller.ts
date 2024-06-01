import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { searchParamsInterface } from '../helpers/interfaces/searchParams.interface';
import { WordAndUserIdDto } from './dto/wordAndUserId.dto';
import {
  searchParams,
  WordAndUserIdParam,
} from '../helpers/params-decorators.helper';
import { UserService } from '../user/user.service';
import { WordService } from './word.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('entries/en')
export class WordController {
  constructor(
    private readonly wordService: WordService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async findAll(
    @searchParams() { search, page, limit }: searchParamsInterface,
  ) {
    return await this.wordService.getWords(search, page, limit);
  }

  @Get(':word')
  async findOne(@WordAndUserIdParam() { word, userId }: WordAndUserIdDto) {
    return await this.wordService.findOne(word, userId);
  }

  @Post(':word/favorite')
  async addFavorite(@WordAndUserIdParam() { word, userId }: WordAndUserIdDto) {
    return await this.userService.addToFavorites(word, userId);
  }

  @Delete(':word/unfavorite')
  async removeFavorite(
    @WordAndUserIdParam() { word, userId }: WordAndUserIdDto,
  ) {
    return await this.userService.removeFavorite(word, userId);
  }
}
