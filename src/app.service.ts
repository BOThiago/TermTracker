import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  challenge(): object {
    return { message: 'Fullstack Challenge 🏅 - Dictionary' };
  }
}
