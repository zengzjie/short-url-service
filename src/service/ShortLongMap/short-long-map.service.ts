import { Inject, Injectable } from '@nestjs/common';
import { UniqueCodeService } from '../UniqueCode/unique-code.service';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UniqueCode } from 'src/entities/UniqueCode';
import { ShortLongMap } from 'src/entities/ShortLongMap';

/**
 * @description: 短码和原始URL映射表
 * @return {*}
 */
@Injectable()
export class ShortLongMapService {
  constructor() {}

  @InjectEntityManager()
  private entitiesManager: EntityManager; // 实体管理器

  @Inject()
  private uniqueCodeService: UniqueCodeService; // 生成短码服务

  /**
   * @description: 从 UniqueCode 表中取出一条未使用的短码，然后插入到 ShortLongMap 表中
   * @param {string} originalUrl 原始URL
   * @return {*}
   */
  async generateShortLongMap(originalUrl: string) {
    // 如果原始URL已存在，则直接返回短码
    const existMap = await this.entitiesManager.findOneBy(ShortLongMap, {
      originalUrl,
    });

    if (existMap) {
      return existMap.shortUrl;
    }

    // 从 UniqueCode 表中取出一条未使用的短码
    let uniqueMap = await this.entitiesManager.findOneBy(UniqueCode, {
      status: 0,
    });

    // 如果不存在，则重新生成
    if (!uniqueMap) {
      uniqueMap = await this.uniqueCodeService.generateCode(true);
    }

    // 插入到 ShortLongMap 表中
    const map = new ShortLongMap();
    map.shortUrl = uniqueMap.code;
    map.originalUrl = originalUrl;

    await this.entitiesManager.insert(ShortLongMap, map);
    // 更新 UniqueCode 表中对应的短码状态为已使用
    await this.entitiesManager.update(UniqueCode, uniqueMap.id, {
      status: 1,
    });

    return uniqueMap.code;
  }

  /**
   * @description: 根据短码获取原始URL
   * @param {string} shortUrl
   * @return {*}
   */
  async getOriginalUrl(shortUrl: string) {
    const map = await this.entitiesManager.findOneBy(ShortLongMap, {
      shortUrl,
    });

    if (!map) {
      return null;
    }

    return map.originalUrl;
  }
}
