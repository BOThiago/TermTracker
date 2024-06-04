import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WordAndUserIdDto {
  @ApiProperty({
    example: '123',
    description: 'userID',
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: 'userID is required.',
  })
  userId: string;

  @ApiProperty({
    example: 'fire',
    description: 'This is the word',
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: 'word is required.',
  })
  word: string;
}
