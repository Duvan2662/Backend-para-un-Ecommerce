import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileName } from './helpers/fileName.helper';
import { Response } from 'express';




@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}



  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter:fileFilter,
    // limits:{
    //   fileSize:1000
    // }
    storage:diskStorage({
      destination:'./static/products',
      filename:fileName,
    })
  }))
  uploadProductImage(@UploadedFile() file:Express.Multer.File){

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${file.filename}`
    return {
      secureUrl
    };
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName:string
  ){

    const path = this.filesService.getStaticProducImage(imageName);
   
    res.sendFile(path)
  }


}
