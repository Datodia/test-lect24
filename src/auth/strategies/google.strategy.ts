import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth2";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(
        private configService: ConfigService
    ){
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['profile', 'email']
        })
    }


    async validate(accessToken, refreshToken, profile, done) {
        const data = {
            email: profile.email,
            fullName: profile.displayName,
            avatar: profile.picture
        }
        done(null, data)
    }
}

