import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取当前上下文
    const response = ctx.getResponse<Response>(); // 获取响应对象
    const request = ctx.getRequest<Request>(); // 获取请求对象
    const status = exception.getStatus(); // 获取状态码
    const exceptionResponse = exception.getResponse(); // 获取异常响应体

    response.status(status).json({
      code: status,
      data: null,
      path: request.url,
      msg: (exceptionResponse as any).message || exception.message,
    });
  }
}
