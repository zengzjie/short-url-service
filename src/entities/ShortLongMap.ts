import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ShortLongMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
    comment: '压缩码',
  })
  shortUrl: string;

  @Column({
    length: 200,
    comment: '原始URL',
  })
  originalUrl: string;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  updateTime: Date;
}
