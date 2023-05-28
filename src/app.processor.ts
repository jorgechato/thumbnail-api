import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as sharp from 'sharp';
import { Logger } from '@nestjs/common';

import { RESIZE_QUEUE } from './constants';


@Processor(RESIZE_QUEUE)
export class ResizeProcessor {
  private readonly logger = new Logger(ResizeProcessor.name);

  @Process()
  async resize(job: Job<{ file: Express.Multer.File }>) {
    this.logger.log(`Resizing in job ${job.id}`);
    this.logger.debug(job.data);

    const { file } = job.data;
    const thumbnailName: string = `${job.id}-${file.filename}.jpeg`;
    const thumbnailPath: string = `thumbnails/${thumbnailName}`;

    await sharp(file.path)
      .resize(100, 100)
      .toFormat('jpeg')
      .toFile(thumbnailPath)
      .catch((error) => job.moveToFailed(error));

    this.logger.log(`Finish job ${job.id}`);
    return {
      id: `${job.id}`,
      status: `${job.getState()}`,
      thumbnailName: thumbnailName,
      thumbnailPath: thumbnailPath
    }
  }
}