import { Mutation, Query, Resolver } from "type-graphql";
import { Test } from "../schema/Test";

@Resolver((of) => Test)
export default class TestResolver {
  private test: Test[] = [{
    name:"test1"
  }];

  @Query((returns) => [Test], { nullable: true })
  getTests(): Test[] {
    return this.test;
  }

  @Mutation((returns) => Test)
  addTest(test: Test) {
    return test;
  }
}
