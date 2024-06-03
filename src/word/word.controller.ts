import {
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { searchParamsInterface } from '../helpers/interfaces/searchParams.interface';
import { WordAndUserIdDto } from './dto/wordAndUserId.dto';
import {
  searchParams,
  WordAndUserIdParam,
} from '../helpers/params-decorators.helper';
import { UserService } from '../user/user.service';
import { WordService } from './word.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomCacheInterceptor } from '../helpers/cacheHeader.interceptor';
import { Request } from 'express';
import { CacheTTL } from '@nestjs/cache-manager';

@UseGuards(JwtAuthGuard)
@Controller('entries/en')
@UseInterceptors(CustomCacheInterceptor)
export class WordController {
  constructor(
    private readonly wordService: WordService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @CacheTTL(60 * 60 * 24)
  async findAll(
    @searchParams() { search, page, limit }: searchParamsInterface,
  ) {
    return await this.wordService.getWords(search, page, limit);
  }

  @Get(':word')
  @CacheTTL(60 * 60 * 24)
  async findOne(
    @WordAndUserIdParam() { word, userId }: WordAndUserIdDto,
    @Req() req: Request,
  ) {
    return await this.wordService.findOne(word, userId, req);
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
