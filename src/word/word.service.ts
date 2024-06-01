import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { firstValueFrom } from 'rxjs';
import { Word } from './schema/words.schema';
import { Model } from 'mongoose';
import { PaginatedResult } from '../helpers/interfaces/paginatedResult.interface';
import { getPaginationInfo } from '../helpers/pagination.helper';
import { UserService } from '../user/user.service';

@Injectable()
export class WordService {
  constructor(
    @InjectModel(Word.name) private readonly wordModel: Model<Word>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(word: string, page: number, limit: number) {
    try {
      const { data } = await this.httpService.axiosRef
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .catch((error) => {
          throw new BadRequestException({
            message: error.response.data.message,
          });
        });

      return data.slice(0, limit);
    } catch (error) {
      throw new BadRequestException({
        message: 'Something went wrong when searching for words.',
      });
    }
  }

  async findOne(word: string, userId: string) {
    try {
      const { data: fullWordData, status } = await this.httpService.axiosRef
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .catch((error) => {
          throw new BadRequestException({
            message: error.response.data.message,
          });
        });

      if (status !== 200)
        throw new BadRequestException({
          message: fullWordData.message,
        });

      this.updateNewWord(word, fullWordData);
      this.userService.addToHistory(word, userId);
      return fullWordData;
    } catch (error) {
      throw new BadRequestException({
        message: 'Something went wrong when searching for word.',
      });
    }
  }

  async updateNewWord(word: string, data: Word[]) {
    try {
      const existingWord = await this.wordModel.findOne({
        word: word,
      });

      if (!existingWord) return this.wordModel.create(data);

      for (const wordData of data) {
        const hasNewData =
          (existingWord.phonetics.length === 0 &&
            wordData.phonetics.length > 0) ||
          (existingWord.sourceUrls.length === 0 &&
            wordData.sourceUrls.length > 0) ||
          (existingWord.meanings.length === 0 && wordData.meanings.length > 0);

        if (hasNewData) {
          await this.wordModel.insertMany(data);
          break;
        }
      }
    } catch (error) {
      console.error('Something went wrong while updating word data');
    }
  }

  async getAllWords() {
    try {
      console.log('JOB - Get all words started ⛏');

      const existingWords = await this.countWords();

      const url =
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';
      const { data: words } = await firstValueFrom(this.httpService.get(url));

      if (existingWords >= Object.keys(words).length) return;

      const wordArray = Object.keys(words).map((word) => ({ word }));

      console.log('Inserting all words into database ⚒');
      await this.wordModel.insertMany(wordArray);
      console.log('Words imported successfully!');
    } catch (error) {
      console.error('An error occurred while importing words.', error.message);
    }
  }

  async getWords(
    search: string,
    page = 0,
    perPage = 10,
  ): Promise<PaginatedResult<string[]>> {
    try {
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
    } catch (error) {
      throw new BadRequestException({
        message: 'Something went wrong when querying words.',
      });
    }
  }

  async countWords(query?: any) {
    try {
      return await this.wordModel.countDocuments(query);
    } catch (error) {
      console.error('Failure to count the number of existing words.');
    }
  }
}
