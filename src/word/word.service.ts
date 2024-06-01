import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { firstValueFrom } from 'rxjs';
import { Word } from './schema/words.schema';
import { Model } from 'mongoose';
import { PaginatedResult } from '../helpers/interfaces/paginatedResult.interface';
import { getPaginationInfo } from '../helpers/pagination.helper';

@Injectable()
export class WordService {
  constructor(
    @InjectModel(Word.name) private readonly wordModel: Model<Word>,
    private readonly httpService: HttpService,
  ) {}

  async getAllWords() {
    try {
      console.log('JOB - Get all words started ⛏');

      const existingWords = await this.countWords();

      const url =
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';
      const { data: words } = await firstValueFrom(this.httpService.get(url));

      if (existingWords >= Object.keys(words).length) {
        console.log('Words are already imported!');
        return;
      }

      const wordArray = Object.keys(words).map((word) => ({ word }));

      console.log('Inserting all words into database ⚒');
      await this.wordModel.insertMany(wordArray);
      console.log('Words imported successfully!');
    } catch (error) {
      console.error('Error importing words', error.message);
    }
  }

  async getWords(
    search: string,
    page = 0,
    perPage = 10,
  ): Promise<PaginatedResult<string[]>> {
    const query = search
      ? { word: { $regex: `^${search}`, $options: 'i' } }
      : {};

    const [searchedWords, totalDocs] = await Promise.all([
      this.wordModel
        .find(query)
        .select('word')
        .limit(perPage)
        .skip(page * perPage)
        .exec(),
      this.countWords(query),
    ]);

    if (!searchedWords)
      throw new BadRequestException({
        message: 'Failed to search for words.',
      });

    if (!totalDocs)
      throw new BadRequestException({
        message: 'Failed to search for the number of words.',
      });

    const results = [searchedWords.map((word) => word.word)];
    const { totalPages, hasNext, hasPrev } = getPaginationInfo(
      totalDocs,
      page,
      perPage,
    );

    return PaginatedResult.createPagination({
      results,
      totalDocs,
      perPage,
      page,
      totalPages,
      hasNext,
      hasPrev,
    });
  }

  async countWords(query?: any) {
    return await this.wordModel.countDocuments(query);
  }
}
