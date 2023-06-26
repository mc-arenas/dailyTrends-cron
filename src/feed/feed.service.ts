import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Feed } from './schemas/feed.schema';

@Injectable()
export class FeedService {
  constructor(@InjectModel(Feed.name) private FeedModel: Model<Feed>) {}

  create(createFeedDto: CreateFeedDto): Promise<Feed> {
    return this.FeedModel.create(createFeedDto);
  }

  async findOneByOriginalUrl(originalUrl: string): Promise<Feed> {
    return this.FeedModel.findOne({ originalUrl }).exec();
  }
}
