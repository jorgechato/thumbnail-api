import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, HttpStatus, ParseFilePipeBuilder, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { ThumbnailService } from './thumbnail.service';


@Controller('thumbnail')
export class ThumbnailController {
    constructor(private readonly thumbnailService: ThumbnailService) { }
    

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async generateThumbnail(@UploadedFile(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: 'image',
            })
            .addMaxSizeValidator({
                maxSize: 1024 * 1024 * 2,
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })) file: Express.Multer.File) {

        return this.thumbnailService.resize(file);
    }

    @Get(':jobId')
    async getThumbnail(@Param('jobId') jobId: number, @Res() res){
        const image = await this.thumbnailService.getThumbnail(jobId);
        return res.download(image);
    }
}
