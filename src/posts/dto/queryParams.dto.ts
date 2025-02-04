import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNumber, Max } from "class-validator"


export class QueryParamsDto {
    @ApiProperty({
        example: 1,
        default: 1,
        required: false
    })
    @Transform(({value}) => Number(value))
    @IsNumber()
    page: number = 1

    @ApiProperty({
        example: 30,
        default: 30,
        required: false
    })
    @Transform(({value}) => Number(value))
    @IsNumber()
    @Max(50)
    take: number = 30

}