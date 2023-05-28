import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from 'src/job/job.controller';
import { JobService } from 'src/job/job.service';

describe('JobController', () => {
  let controller: JobController;
  let service: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: {
            getJobs: jest.fn(),
            getJob: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobController>(JobController);
    service = module.get<JobService>(JobService);
  });

  describe('getJobs', () => {
    it('should return an object with completed, failed, active, delayed, and waiting jobs', async () => {
      const completedJob = { id: 1 };
      const failedJob = { id: 2 };
      const activeJob = { id: 3 };
      const delayedJob = { id: 4 };
      const waitingJob = { id: 5 };

      (service.getJobs as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          completed: [completedJob],
          failed: [failedJob],
          active: [activeJob],
          delayed: [delayedJob],
          waiting: [waitingJob],
        }),
      );

      const result = await controller.getJobs();

      expect(result).toEqual({
        completed: [{ id: 1 }],
        failed: [{ id: 2 }],
        active: [{ id: 3 }],
        delayed: [{ id: 4 }],
        waiting: [{ id: 5 }],
      });
    });
  });

  describe('getJob', () => {
    it('should return the job with the given ID', async () => {
      const job = {
        id: 1,
        status: 'completed',
        thumbnail: '/thumbnail/1'
      };

      (service.getJob as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(job),
      );

      const result = await controller.getJob(1);

      expect(result).toEqual({
        id: 1,
        status: 'completed',
        thumbnail: '/thumbnail/1',
      });
    });
  });
});