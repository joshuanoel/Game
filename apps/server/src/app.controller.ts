import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('*')
  serve(@Res() res: Response) {
    res.sendFile(join(__dirname, '../../client/dist/index.html'));
  }
}
