import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import * as bcript from 'bcrypt'
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}


    async signUp(signUpDto: SignUpDto){
        const existUser = await this.usersService.findOneByEmail(signUpDto.email)
        if(existUser) throw new BadRequestException('User already exists')

        const hashedPass = await bcript.hash(signUpDto.password, 10)
        await this.usersService.create({...signUpDto, password: hashedPass})
        return 'user registered successfully'
    }


    async signIn(signInDto: SignInDto){
        const existUser = await this.usersService.findOneByEmail(signInDto.email)
        if(!existUser) throw new BadRequestException('Email is incorect')
        
        const isPassEqual = await bcript.compare(signInDto.password, existUser.password)
        if(!isPassEqual) throw new BadRequestException('Password is incorect')

        const payLoad = {
            userId: existUser._id,
            role: existUser.role
        }

        const accessToken = await this.jwtService.sign(payLoad, {expiresIn: '1h'})
        return {accessToken}
    }


    async getCurrentUser(userId: string){
        const user = await this.usersService.findOne(userId)
        return user
    }
}
