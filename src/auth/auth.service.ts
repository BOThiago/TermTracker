import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schema/user.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(credentials: SignupDto) {
    const existingUser = await this.userModel.findOne({
      email: credentials.email,
    });
    if (existingUser)
      throw new BadRequestException({ message: 'E-mail already in use' });

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const user = new this.userModel({
      name: credentials.name,
      email: credentials.email,
      password: hashedPassword,
    });
    await user.save();

    const token = this.jwtService.sign({ userId: user._id });
    return { id: user._id, name: user.name, token: `Bearer ${token}` };
  }

  async signin(credentials: SigninDto) {
    const user = await this.userModel.findOne({ email: credentials.email });
    if (user && (await bcrypt.compare(credentials.password, user.password))) {
      const token = this.jwtService.sign({ userId: user._id });
      return { id: user._id, name: user.name, token: `Bearer ${token}` };
    }
    throw new UnauthorizedException({
      message: 'user or password incorrect.',
    });
  }
}
