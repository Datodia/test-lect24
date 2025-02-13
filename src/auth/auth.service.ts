import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import * as bcript from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private emailSernder: EmailSenderService,
        @InjectModel(User.name) private userModel: Model<User>
    ){}


    async signUp(signUpDto: SignUpDto){
        const existUser = await this.userModel.findOne({email: signUpDto.email})
        if(existUser) throw new BadRequestException('User already exists')

        const hashedPass = await bcript.hash(signUpDto.password, 10)
        const otpCode = Math.random().toString().slice(2, 8)
        const validateOtpCodeDate = new Date()
        validateOtpCodeDate.setTime(validateOtpCodeDate.getTime() + 3 * 60 * 1000)
        await this.userModel.create({...signUpDto, password: hashedPass, otpCode, validateOtpCodeDate})
        await this.emailSernder.sendTextToEmail(signUpDto.email, 'Verification Code', otpCode)

        return 'Verify email'
    }

    async verifyEmail(email, otpCode){
        const user = await this.userModel.findOne({email})
        if(!user) throw new NotFoundException('user does not exist')

        if(user.isVerified) throw new BadRequestException('user already verified')

        if(!user.validateOtpCodeDate || user.validateOtpCodeDate < new Date()) {
            throw new BadRequestException('Opt code is out dated')
        }

        if(otpCode !== user.otpCode) throw new BadRequestException('Wrong Otp code')

        await this.userModel.findByIdAndUpdate(user._id, {
            $set: {isVerified: true, otpCode: null, validateOtpCodeDate: null}
        })

        const payLoad = {
            userId: user._id,
            role: user.role,
        }
        const accessToken = await this.jwtService.sign(payLoad, {expiresIn: '1h'})

        return {
            message: "verified successfully",
            accessToken
        }

    }

    async resendVerifyCode(email){
        const user = await this.userModel.findOne({email})
        if(!user) throw new NotFoundException('user not found')

        if(user.isVerified) throw new BadRequestException('user already verified')
        
        const otpCode = Math.random().toString().slice(2, 8)
        const validateOtpCodeDate = new Date()
        validateOtpCodeDate.setTime(validateOtpCodeDate.getTime() + 3 * 60 * 1000)

        await this.userModel.findByIdAndUpdate(user._id, {
            $set: {otpCode, validateOtpCodeDate}
        })
        await this.emailSernder.sendTextToEmail(email, 'resend verification code', otpCode)

        return 'resent Otp Code'
    }


    async signIn(signInDto: SignInDto){
        const existUser = await this.userModel.findOne({email: signInDto.email}).select('password')
        if(!existUser) throw new BadRequestException('Email is incorect')

        const isPassEqual = await bcript.compare(signInDto.password, existUser.password)
        if(!isPassEqual) throw new BadRequestException('Password is incorect')

        if(!existUser.isVerified) throw new BadRequestException('verify email')

        const payLoad = {
            userId: existUser._id,
            role: existUser.role
        }

        const accessToken = await this.jwtService.sign(payLoad, {expiresIn: '1h'})
        return {accessToken}
    }


    async getCurrentUser(userId: string){
        const user = await this.userModel.findById(userId)
        return user
    }
}
