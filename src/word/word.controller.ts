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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Word')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCacheInterceptor)
@Controller('entries/en')
export class WordController {
  constructor(
    private readonly wordService: WordService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @CacheTTL(60 * 60 * 24)
  @ApiOperation({ summary: 'Search for words' })
  @ApiParam({
    name: 'search',
    description: 'Search term',
    required: false,
    type: String,
  })
  @ApiParam({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiParam({
    name: 'limit',
    description: 'Limit per page',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of words retrieved successfully',
  })
  async findAll(
    @searchParams() { search, page, limit }: searchParamsInterface,
  ) {
    return await this.wordService.getWords(search, page, limit);
  }

  @Get(':word')
  @CacheTTL(60 * 60 * 24)
  @ApiOperation({ summary: 'Get details for a specific word' })
  @ApiParam({
    name: 'search',
    description: 'Search term',
    required: false,
    type: String,
  })
  @ApiParam({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiParam({
    name: 'limit',
    description: 'Limit per page',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Word details retrieved successfully',
  })
  async findOne(
    @WordAndUserIdParam() { word, userId }: WordAndUserIdDto,
    @Req() req: Request,
  ) {
    return await this.wordService.findOne(word, userId, req);
  }

  @Post(':word/favorite')
  @ApiOperation({ summary: 'Add word to user favorites' })
  @ApiResponse({
    status: 200,
    description: 'Word added to favorites successfully',
  })
  @ApiResponse({ status: 400, description: 'Word already favorited' })
  async addFavorite(@WordAndUserIdParam() { word, userId }: WordAndUserIdDto) {
    return await this.userService.addToFavorites(word, userId);
  }

  @Delete(':word/unfavorite')
  @ApiOperation({ summary: 'Remove word from user favorites' })
  @ApiResponse({
    status: 204,
    description: 'Word removed from favorites successfully',
  })
  @ApiResponse({ status: 400, description: 'Word is not favorited' })
  async removeFavorite(
    @WordAndUserIdParam() { word, userId }: WordAndUserIdDto,
  ) {
    return await this.userService.removeFavorite(word, userId);
  }
}
