import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    fullName: string

    @IsNotEmpty()
    @IsEmail()
    email: string


    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password: string
}
