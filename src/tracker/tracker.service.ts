import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TrackerService {
  async trackWords(term: string): Promise<string[]> {
    return await axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new BadRequestException('Term not found', error.message);
      });
  }
}
