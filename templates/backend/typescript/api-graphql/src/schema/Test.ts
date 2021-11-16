import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Test{
    @Field()
    name: string;
}