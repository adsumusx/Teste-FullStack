import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id!: string; 

  @Column("text")
  name!: string;

  @Column("text")
  datatype!: string;

  @Column({ name: "is_required", default: false })
  isRequired!: boolean;
 
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}