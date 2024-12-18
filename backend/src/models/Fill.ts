import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Field } from "./Field";

@Entity()
export class Fill {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @ManyToOne(() => Field)
  @JoinColumn({ name: "fieldId" }) 
  fieldId!: string; 

  @Column("text")
  value!: string | number | boolean | Date;

  @Column()
  isRequired!: boolean;
  
  @CreateDateColumn()
  createdAt!: Date;
}