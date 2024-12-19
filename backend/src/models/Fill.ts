import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Field } from "./Field";

@Entity()
export class Fill {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "field_id" })
  fieldId!: string;

  @Column("text")
  value!: string | number | boolean | Date;

  @Column({ name: "is_required", default: false })
  isRequired!: boolean;
  
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}