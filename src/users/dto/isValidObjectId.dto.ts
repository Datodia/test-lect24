import { IsMongoId } from "class-validator";
import mongoose from "mongoose";

export class IsValidObjectId {
    @IsMongoId()
    id: mongoose.Schema.Types.ObjectId
}