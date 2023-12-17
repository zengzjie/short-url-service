import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UniqueCode } from './entities/UniqueCode';
import { UniqueCodeService } from './service/UniqueCode/unique-code.service';
import { ShortLongMap } from './entities/ShortLongMap';
import { ShortLongMapService } from './service/ShortLongMap/short-long-map.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './intercept/TransformResponse.intercept';
import { HttpExceptionFilter } from './filter/HttpException.filter';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 定时任务
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'zengzijie',
      database: 'short_url_service',
      synchronize: true,
      logging: true,
      entities: [UniqueCode, ShortLongMap],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authplugins: 'caching_sha2_password',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UniqueCodeService,
    ShortLongMapService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor, // 全局响应拦截器
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // 全局异常过滤器
    },
  ],
})
export class AppModule {}
