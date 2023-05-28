import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bull';

import { ThumbnailController } from './thumbnail/thumbnail.controller';
import { JobController } from './job/job.controller';
import { RESIZE_QUEUE } from './constants';
import { ThumbnailService } from './thumbnail/thumbnail.service';
import { ResizeProcessor } from './app.processor';
import { JobService } from './job/job.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads'
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        }
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: RESIZE_QUEUE,
    }),
  ],
  controllers: [ThumbnailController, JobController],
  providers: [ThumbnailService, JobService, ResizeProcessor],
})
export class AppModule { }
