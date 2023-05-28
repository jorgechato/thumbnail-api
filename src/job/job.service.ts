import { InjectQueue } from '@nestjs/bull';
import { Injectable, HttpException } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { RESIZE_QUEUE } from 'src/constants';


@Injectable()
export class JobService {
    constructor(@InjectQueue(RESIZE_QUEUE) private readonly resizeQueue: Queue) { }

    async getJobs() {
        const completed: Job[] = await this.resizeQueue.getJobs(['completed']);
        const failed: Job[] = await this.resizeQueue.getJobs(['failed']);
        const active: Job[] = await this.resizeQueue.getJobs(['active']);
        const delayed: Job[] = await this.resizeQueue.getJobs(['delayed']);
        const waiting: Job[] = await this.resizeQueue.getJobs(['waiting']);

        return {
            completed: completed.map((job) => ({
                    id: `${job.id}`,
                    thumbnail: `/thumbnail/${job.id}`,
            })),
            failed: failed.map((job) => ({id: `${job.id}`})),
            active: active.map((job) => ({id: `${job.id}`})),
            delayed: delayed.map((job) => ({id: `${job.id}`})),
            waiting: waiting.map((job) => ({id: `${job.id}`})),
        };
    }

    async getJob(id: number) {
        const job: Job = await this.resizeQueue.getJob(id);

        if (!job) {
            throw new HttpException(`Job with ID ${id} not found`, 404);
        }

        const status: string = await job.getState();

        return {
            id: `${job.id}`,
            status: status,
            thumbnail: `/thumbnail/${job.id}`,
        };
    }
}
