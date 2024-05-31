import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @IsString()
  readonly password: string;
}
