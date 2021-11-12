import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("costumers")
export default class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
