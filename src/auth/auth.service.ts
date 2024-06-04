import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signup(credentials: SignupDto) {
    if (!credentials.name || !credentials.email || !credentials.password)
      throw new BadRequestException({
        message: 'Credentials, name, email and password must be filled in',
      });

    const existingUser = await this.userService.findByEmail(credentials.email);

    if (existingUser)
      throw new BadRequestException({ message: 'E-mail already in use' });

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const user = await this.userService.create({
      name: credentials.name,
      email: credentials.email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ userId: user._id });
    return { id: user._id, name: user.name, token: `Bearer ${token}` };
  }

  async signin(credentials: SigninDto) {
    const user = await this.userService.findByEmail(credentials.email);
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      const token = this.jwtService.sign({ userId: user._id });
      return { id: user._id, name: user.name, token: `Bearer ${token}` };
    }
    throw new UnauthorizedException({
      message: 'user or password incorrect.',
    });
  }
}
