import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'The user name',
    example: 'William',
    required: true,
  })
  @IsNotEmpty({
    message: 'name is required',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The user email',
    example: 'john.mckinley@examplepetstore.com',
    required: true,
  })
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The user password',
    required: true,
  })
  @IsNotEmpty({
    message: 'password is required',
  })
  @IsString()
  readonly password: string;
}
