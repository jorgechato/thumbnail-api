import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';

describe('JobService', () => {
  let service: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobService],
    }).compile();

    service = module.get<JobService>(JobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getJobs', () => {
    it('should return an object with completed, failed, active, delayed and waiting jobs', async () => {
      const jobs = await service.getJobs();
      expect(jobs).toHaveProperty('completed');
      expect(jobs).toHaveProperty('failed');
      expect(jobs).toHaveProperty('active');
      expect(jobs).toHaveProperty('delayed');
      expect(jobs).toHaveProperty('waiting');
    });
  });
});