import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PostsController } from 'src/posts/posts.controller';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    example: 'user registered successfully',
  })
  @ApiBadRequestResponse({
    example: {
      message: "user already exists",
      error: "Bad request",
      status: 400
    }
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto){
    return this.authService.signUp(signUpDto)
  }


  @ApiOkResponse({
    example: {
      acessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdmZmViYzdkNjZjMWVmZmYzMTEzM2YiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNjg3MTUwNCwiZXhwIjoxNzM2ODc1MTA0fQ.ksKGVsa-7mwlUYEyBpeY_eFEEi_1suKmiB6d0vT5xO8"
    }
  })
  @ApiBadRequestResponse({
    examples: {
      ['invalidEmal']: {summary: 'Invalid Email', value: {
        message: "email is incorrect",
        error: "bad request",
        status: 400
      }},
      ['invalidPassword']: {summary: 'Invalid password', value: {
        message: "password is incorrect",
        error: "bad request",
        status: 400
      }}
    }
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto){
    return this.authService.signIn(signInDto)
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    example: {
      _id: "677ffebc7d66c1efff31133f",
      fullName: "Giorgi giorgadze",
      email: "giorgi@gmail.com",
      role: "user",
      posts: [
        {
          _id: "678005d83e3f983ad70243e4",
          title: "test title",
          content: "test content",
          __v: 0
        },
      ]
    }
  })
  @ApiUnauthorizedResponse({
    example: {
      message: "unauthorized",
      status: 401
    }
  })
  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() userId){
    return this.authService.getCurrentUser(userId)
  }
}
