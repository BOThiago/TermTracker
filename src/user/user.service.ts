import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserProfile(userId: string) {
    return this.userModel.findById(userId).select('-password');
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
}
