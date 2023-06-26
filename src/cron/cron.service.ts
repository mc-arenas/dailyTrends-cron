import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getDataELPAIS, getDataELMUNDO } from '../scraping';
import { FeedService } from 'src/feed/feed.service';
import { Feed } from 'src/feed/schemas/feed.schema';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly feedService: FeedService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    try {
      this.logger.debug(`Called at ${new Date()}`);
      const allData: Feed[] = [];
      // get data from EL PAIS
      const ELPAISnews = await getDataELPAIS('https://elpais.com', 'EL PAIS');
      // add news
      allData.push(...ELPAISnews);

      // get data from EL MUNDO
      const ELMUNDOnews = await getDataELMUNDO(
        'https://www.elmundo.es',
        'EL MUNDO',
      );
      allData.push(...ELMUNDOnews);

      // create data in db
      await Promise.all(
        allData.map(async (x) => {
          await this.feedService.create(x);
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        `Internal server error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
