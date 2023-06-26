import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { Feed, FeedSchema } from './schemas/Feed.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedController } from './feed.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feed.name, schema: FeedSchema }]),
  ],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
