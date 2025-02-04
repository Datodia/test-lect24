import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class SignInDto {

    @ApiProperty({
        example: 'giorgi@gmail.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'giorgio123',
        minLength: 6,
        maxLength: 20
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password: string

}
