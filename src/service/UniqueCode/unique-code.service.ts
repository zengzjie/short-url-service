import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { generateRandomStr } from 'src/utils';
import { EntityManager } from 'typeorm';
import { UniqueCode } from 'src/entities/UniqueCode';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * @description: 使用定时任务，每天定时生成短码
 * @return {*}
 */
@Injectable()
export class UniqueCodeService {
  @InjectEntityManager()
  private entitiesManager: EntityManager;

  private codeList: UniqueCode[] = [];

  /**
   * @description: 生成短码
   * @return {*}
   */
  async generateCode(isInsert = false) {
    // 生成6位随机字符串
    const code = generateRandomStr(6);

    // 查询数据库是否存在该短码
    const uniqueCode = await this.entitiesManager.findOneBy(UniqueCode, {
      code,
    });

    // 如果不存在，则插入数据库
    if (!uniqueCode) {
      const newUniqueCode = new UniqueCode();
      newUniqueCode.code = code;
      newUniqueCode.status = 0;

      if (isInsert) {
        await this.entitiesManager.insert(UniqueCode, newUniqueCode);
      } else {
        this.codeList.push(newUniqueCode);
      }
      return newUniqueCode;
    } else {
      // 如果存在，则重新生成
      return await this.generateCode();
    }
  }

  // 每天凌晨1点执行
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async batchGenerateCode() {
    for (let i = 0; i < 10000; i++) {
      await this.generateCode();
      // 如果 codeList 长度等于20，则进行批量插入
      if (this.codeList.length === 20) {
        await this.entitiesManager.insert(UniqueCode, this.codeList);
        this.codeList = [];
      }
    }
  }

  async getAllCode() {
    return await this.entitiesManager.find(UniqueCode);
  }
}
