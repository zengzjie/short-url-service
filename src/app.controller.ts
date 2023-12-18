import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ShortLongMapService } from './service/ShortLongMap/short-long-map.service';
import { SkipTransform } from './decorator/SkipTransform.decorator';
import { UniqueCodeService } from './service/UniqueCode/unique-code.service';
import { UniqueCode } from './entities/UniqueCode';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  private uniqueCodeService: UniqueCodeService;

  @Inject()
  private shortLongMapService: ShortLongMapService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('allCode')
  async getAllCode(): Promise<UniqueCode[]> {
    return await this.uniqueCodeService.getAllCode();
  }

  @Get('shortUrl')
  async generateShortUrl(@Query('url') originalUrl: string) {
    return await this.shortLongMapService.generateShortLongMap(originalUrl);
  }

  @Get(':code')
  @SkipTransform()
  @Redirect() // Redirect中省略了参数默认 statusCode 为302重定向
  async redirectOriginalUrl(@Param('code') code: string) {
    const url = await this.shortLongMapService.getOriginalUrl(code);

    if (!url) {
      throw new BadRequestException('短链码不存在');
    }

    return {
      url,
    };
  }
}
