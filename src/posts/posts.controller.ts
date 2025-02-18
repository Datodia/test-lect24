import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsValidObjectId } from 'src/users/dto/isValidObjectId.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/user.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { QueryParamsDto } from './dto/queryParams.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiUnauthorizedResponse({
    example: {
      message: "unauthorized",
      statusCode: 401
    }
  })
  @ApiCreatedResponse({
    example: {
        "title": "title",
        "content": "content",
        "user": "677ffebc7d66c1efff31133f",
        "_id": "678694a216f8fa5719634bbc",
        "__v": 0
    }
  })
  @Post()
  create(@User() userId, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(userId,createPostDto);
  }

  @ApiOkResponse({
    example: [
        {
          "_id": "676d8b4a3a6ec7ed999fc117",
          "title": "Post1",
          "content": "constnt1",
          "user": {
            "fullName": "Nika",
            "email": "nika@gmail.com"
          },
          "__v": 0
        }
      ]
  })
  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.postsService.findAll(query);
  }
  
  @ApiNotFoundResponse({
    example: {
      "message": "post not found",
      "error": "Not Found",
      "statusCode": 404
    }
  })
  @ApiOkResponse({
    example: {
      "_id": "678005e73e3f983ad70243e7",
      "title": "meore title",
      "content": "meore content",
      "user": {
        "_id": "677ffebc7d66c1efff31133f",
        "fullName": "giorgi",
        "email": "giorgi@gmail.com",
        "role": "user",
        "__v": 0
      },
      "__v": 0
    }
  })
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    example: "677ffebc7d66c1efff31133f"
  })
  findOne(@Param() params: IsValidObjectId) {
    console.log(params.id, "params id")
    return this.postsService.findOne(params.id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    example: "677ffebc7d66c1efff31133f"
  })
  update(@Param() params: IsValidObjectId, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(params.id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param() params: IsValidObjectId) {
    return this.postsService.remove(params.id);
  }
}
