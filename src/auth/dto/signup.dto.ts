import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({
    message: 'name is required',
  })
  @IsString()
  readonly name: string;

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
