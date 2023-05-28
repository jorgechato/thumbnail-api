import { InjectQueue } from '@nestjs/bull';
import { Injectable, HttpException } from '@nestjs/common';
import { Queue } from 'bull';

import { RESIZE_QUEUE } from 'src/constants';


@Injectable()
export class ThumbnailService {
    constructor(@InjectQueue(RESIZE_QUEUE) private readonly resizeQueue: Queue) { }

    async resize(file: Express.Multer.File) {
        const job = await this.resizeQueue.add({ file: file });
        const status: string = await job.getState();
        
        return {
            id: `${job.id}`,
            status: status,
            thumbnail: `/thumbnail/${job.id}`,
        };
    }
    
    async getThumbnail(id: number) {
        const job = await this.resizeQueue.getJob(id);
        
        if (!job) {
            throw new HttpException(`Thumbnail with ID ${id} not found`, 404);
        }
        
        const status: string = await job.getState();
        
        if (status === 'completed') {
            return job.returnvalue.thumbnailPath;
        }
        
        throw new HttpException(`Thumbnail with ID ${id} is not ready yet, the status is ${status}`, 406);
    }
}
