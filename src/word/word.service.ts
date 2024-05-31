import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { firstValueFrom } from 'rxjs';
import { Word } from './schema/words.schema';
import { Model } from 'mongoose';

@Injectable()
export class WordService {
  constructor(
    @InjectModel(Word.name) private wordModel: Model<Word>,
    private readonly httpService: HttpService,
  ) {}

  async getAllWords() {
    try {
      console.log('JOB - Get all words started ⛏');

      const existingWords = await this.countWords();

      const url =
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';
      const response = await firstValueFrom(this.httpService.get(url));

      if (existingWords >= Object.keys(response.data).length) {
        console.log('Words are already imported!');
        return;
      }

      const wordArray = Object.keys(response.data).map((word) => ({ word }));

      console.log('Inserting all words into database ⚒');
      await this.wordModel.insertMany(wordArray);
      console.log('Words imported successfully!');
    } catch (error) {
      console.error('Error importing words', error.message);
    }
  }

  async getWords(search?: string, page: number = 0, limit: number = 10) {
    let query = {};
    if (search) query = { word: { $regex: `^${search}`, $options: 'i' } };

    const searchedWords = await this.wordModel
      .find(query)
      .select('word')
      .limit(limit)
      .skip(page * limit)
      .exec();

    const totalDocs = await this.countWords(query);
    const pages = Math.ceil(totalDocs / limit);

    return {
      results: [searchedWords.map((word) => word.word)],
      totalDocs: totalDocs,
      perPage: Number(limit),
      page: Number(page) + 1,
      totalPages: pages,
      hasNext: page + 1 < pages,
      hasPrev: page > 0,
    };
  }

  async countWords(query?: any) {
    return await this.wordModel.countDocuments(query);
  }
}
