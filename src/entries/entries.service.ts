import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class EntriesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  async findAll(word: string, page: number, limit: number) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      ),
    ).catch((error) => {
      throw new BadRequestException({
        message: error.response.data.message,
      });
    });

    return data.slice(0, limit);
  }

  async findOne(word: string, userId: string) {
    const { data, status } = await firstValueFrom(
      this.httpService.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      ),
    ).catch((error) => {
      throw new BadRequestException({
        message: error.response.data.message,
      });
    });

    if (status !== 200)
      throw new BadRequestException({
        message: data.message,
      });

    await this.userService.addToHistory(word, userId);
    return data;
  }

  async findFavorites(userId: string) {
    return await this.userService.getUserFavorites(userId);
  }

  async addFavorite(word: string, userId: string) {
    return await this.userService.addToFavorites(word, userId);
  }

  async removeFavorite(word: string, userId: string) {
    return await this.userService.removeFavorite(word, userId);
  }
}
