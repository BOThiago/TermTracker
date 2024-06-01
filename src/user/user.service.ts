import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async create(user: UserDto) {
    return await new this.userModel(user).save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async getUserProfile(userId: string) {
    return await this.userModel.findById(userId).select('-password');
  }

  async getUserHistory(userId: string) {
    const { history } = await this.userModel.findById(userId).select('history');
    return history;
  }

  async getUserFavorites(userId: string) {
    const { favorites } = await this.userModel
      .findById(userId)
      .select('favorites');
    return favorites;
  }

  async addToHistory(word: string, userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      const added = new Date();
      const historyWord = { word, added };

      if (!user.history.includes(historyWord)) {
        user.history.push(historyWord);
        await user.save();
      }
    } catch (error) {
      console.error('Something went wrong while adding word to history.');
    }
  }

  async addToFavorites(word: string, userId: string) {
    const user = await this.userModel.findById(userId);
    const added = new Date();
    const favoriteWord = { word, added };

    const isAlreadyFavorited = user.favorites.some(
      (favorite) => favorite.word === word,
    );
    if (isAlreadyFavorited)
      throw new BadRequestException('Word is already favorited.');

    if (!user.favorites.includes(favoriteWord)) {
      user.favorites.push(favoriteWord);
      await user.save();
    }

    return favoriteWord;
  }

  async removeFavorite(word: string, userId: string) {
    const user = await this.userModel.findById(userId);
    const index = user.favorites
      .slice(0)
      .findIndex((item) => item.word === word);

    if (index <= -1) throw new BadRequestException('Word is not favorited');

    if (index !== -1) {
      user.favorites.splice(index, 1);
      await user.save();
    }

    throw new HttpException(
      'Word removed from favorites',
      HttpStatus.NO_CONTENT,
    );
  }
}
