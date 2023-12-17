import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @description: 生成的短码表
 */
@Entity()
export class UniqueCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    comment: '短码',
  })
  code: string;

  @Column({
    comment: '状态：0-未使用，1-已使用',
  })
  status: number;
}
