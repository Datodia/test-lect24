import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class SignUpDto {
    @ApiProperty({
        example: 'giorgi giorgadze'
    })
    @IsNotEmpty()
    @IsString()
    fullName: string

    @ApiProperty({
        example: "giorgi@gmail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: "giorgi1234",
        minLength: 6,
        maxLength: 20
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password: string
}
