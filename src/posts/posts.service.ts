import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import mongoose, { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { QueryParamsDto } from './dto/queryParams.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService
  ){}

  async create(userId, createPostDto: CreatePostDto) {
    const newPost = await this.postModel.create({...createPostDto, user: userId})
    await this.userService.addPost(newPost._id, userId)
    return newPost
  }

  findAll({page, take}: QueryParamsDto) {
    return this.postModel.find().skip((page - 1) * take).limit(page * take).populate({path: 'user', select: '-_id -posts -role -__v'})
  }

  async findOne(id: mongoose.Schema.Types.ObjectId) {
    const post = await this.postModel.findById(id).populate({path: 'user', select: '-posts'})
    if(!post) throw new NotFoundException('post not found')
    return post
  }

  update(id: mongoose.Schema.Types.ObjectId, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: mongoose.Schema.Types.ObjectId) {
    return `This action removes a #${id} post`;
  }

  async removePostsByUserId(id){
    await this.postModel.deleteMany({user: id})
    console.log('deleted all posts by id ' + id)
  }
}
