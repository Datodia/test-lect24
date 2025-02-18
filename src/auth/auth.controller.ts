import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'src/users/user.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PostsController } from 'src/posts/posts.controller';
import { VerifyEmailDto } from './dto/verifyemil.dto';
import { GoogleAuthGuard } from './guards/google-oauth.guard';

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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async auth(){}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res){
    const token = await this.authService.singInWithGoogle(req.user)
    res.redirect(`${process.env.FRONT_URL}/sign-in?token=${token}`)
  }

  @Post('verify-email')
  verifyEmail(@Body() {email, otpCode}:VerifyEmailDto ){

    return this.authService.verifyEmail(email, otpCode)
  }

  @Post('resend-verify-code')
  resendVerifyCode(@Body() body){
    return this.authService.resendVerifyCode(body.email)
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
