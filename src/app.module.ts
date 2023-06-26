import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017'),
    ScheduleModule.forRoot(),
    FeedModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}
