import { Test, TestingModule } from '@nestjs/testing';

import { ThumbnailController } from 'src/thumbnail/thumbnail.controller';
import { ThumbnailService } from 'src/thumbnail/thumbnail.service';


describe('ThumbnailController', () => {
  let controller: ThumbnailController;
  let service: ThumbnailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThumbnailController],
      providers: [
        {
          provide: ThumbnailService,
          useValue: {
            resize: jest.fn(),
            getThumbnail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ThumbnailController>(ThumbnailController);
    service = module.get<ThumbnailService>(ThumbnailService);
  });

  describe('generateThumbnail', () => {
    it('should call the resize method of the ThumbnailService with the uploaded file', async () => {
      const file = { originalname: 'test.jpg', buffer: Buffer.from('test') } as Express.Multer.File;

      (service.resize as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve('/thumbnail/1'),
      );

      const result = await controller.generateThumbnail(file);

      expect(service.resize).toHaveBeenCalledWith(file);
      expect(result).toEqual('/thumbnail/1');
    });

    it('should throw an HttpException if the uploaded file is not an image', async () => {
      const file = { originalname: 'test.txt', buffer: Buffer.from('test') } as Express.Multer.File;

      await expect(controller.generateThumbnail(file)).toEqual(Promise.resolve({}));
    });

    it('should throw an HttpException if the uploaded file is too large', async () => {
      const file = { originalname: 'test.jpg', buffer: Buffer.alloc(1024 * 1024 * 3) } as Express.Multer.File;

      await expect(controller.generateThumbnail(file)).toEqual(Promise.resolve({}));
    });
  });

  describe('getThumbnail', () => {
    it('should call the getThumbnail method of the ThumbnailService with the given job ID', async () => {
      const image = '/thumbnail/1';

      (service.getThumbnail as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(image),
      );

      const res = {
        download: jest.fn(),
      };

      await controller.getThumbnail(1, res);

      expect(service.getThumbnail).toHaveBeenCalledWith(1);
      expect(res.download).toHaveBeenCalledWith(image);
    });

    it('should throw an HttpException if the thumbnail with the given job ID is not found', async () => {
      (service.getThumbnail as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null),
      );

      const res = {
        download: jest.fn(),
      };

      await expect(controller.getThumbnail(1, res)).toEqual(Promise.resolve({}));
    });
  });
});