import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Role } from "src/enums/role.enam";

@Schema()
export class User {

    @Prop({type: String})
    fullName: string

    @Prop({type: String})
    email: string

    @Prop({type: String, select: false})
    password: string

    @Prop({type: String, default: Role.USER})
    role: string

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Post', default: []})
    posts: mongoose.Schema.Types.ObjectId[]

    @Prop({type: String})
    otpCode: string

    @Prop({type: Date})
    validateOtpCodeDate: Date

    @Prop({type: Boolean, default: false})
    isVerified: boolean

    @Prop({type: String})
    avatar: string

}

export const UserSchema = SchemaFactory.createForClass(User)