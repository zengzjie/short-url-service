import { SetMetadata } from '@nestjs/common';

/**
 * 创建一个自定义装饰器，用于标记那些不应该被全局拦截器处理的路由。
 * 在拦截器中检查这个装饰器，如果请求的路由包含这个装饰器，则跳过拦截器的处理。
 */
export const SKIP_TRANSFORM = 'skipTransform';
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM, true);
