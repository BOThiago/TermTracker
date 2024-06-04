import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty({
    message: 'name is required',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty({
    message: 'password is required',
  })
  @IsString()
  readonly password: string;
}
