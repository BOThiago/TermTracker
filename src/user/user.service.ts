import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async create(user: UserDto) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

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
