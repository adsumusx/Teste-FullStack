import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id!: string; 

  @Column()
  name!: string;

  @Column()
  datatype!: string;

  @Column()
  isRequired!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}