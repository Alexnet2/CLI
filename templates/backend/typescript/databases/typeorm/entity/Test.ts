import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
