import { Controller, Get, Param } from '@nestjs/common';

import { JobService } from './job.service';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @Get('list')
    async getJobs() {
        return this.jobService.getJobs();
    }

    @Get(':id')
    async getJob(@Param('id') id: number) {
        return this.jobService.getJob(id);
    }
}
