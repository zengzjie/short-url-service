import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
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
    default: () => 'CURRENT_TIMESTAMP',
    precision: 0,
  })
  create_time: Date;

  @Column({
    comment: '更新时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  update_time: Date;
}
