import { IsNotEmpty, IsString } from 'class-validator';

export class WordAndUserIdDto {
  @IsString()
  @IsNotEmpty({
    message: 'userID is required.',
  })
  userId: string;

  @IsString()
  @IsNotEmpty({
    message: 'word is required.',
  })
  word: string;
}
