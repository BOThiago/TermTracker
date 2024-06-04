import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: 'email',
    example: 'john.mclean@examplepetstore.com',
    required: true,
  })
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'password',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({
    message: 'password is required',
  })
  @IsString()
  readonly password: string;
}
