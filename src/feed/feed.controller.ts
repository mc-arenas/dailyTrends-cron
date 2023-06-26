import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  HttpCode,
  Put,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  async create(createFeedDto: CreateFeedDto) {
    // check if there is another feed related to the same new
    const auxNew = await this.feedService.findOneByOriginalUrl(
      createFeedDto.originalUrl,
    );
    if (auxNew !== null) {
      throw new HttpException(
        `Bad Request, the new id ${createFeedDto.originalUrl} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.feedService.create(createFeedDto);
  }
}
