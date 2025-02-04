import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => PostsService))
    private postService: PostsService
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto)
    return user
  }

  findAll() {
    return this.userModel.find()
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).populate({path: 'posts', select: '-user'})
    return user
  }
  
  async findOneByEmail(email: string){
    const user = await this.userModel.findOne({email: email}).select('+password')
    return user
  }

  async update( id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true})
    return updatedUser
  }

  async remove(id: mongoose.Schema.Types.ObjectId) {
    const deletedUser = await this.userModel.findByIdAndDelete(id)
    if(!deletedUser) throw new BadRequestException('user not found')
    await this.postService.removePostsByUserId(deletedUser._id)
    return deletedUser
  }


  async addPost(postId, userId){
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, {$push: {posts: postId}}, {new: true} )
    return updatedUser
  }
}
