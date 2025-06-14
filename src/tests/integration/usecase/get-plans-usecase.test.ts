import { IFactory } from "@/application";
import GetPlansUseCase from "@/application/usecases/plan/get-plans.usecase";
import { makeFactory } from "@/infra/factories/factory";
import {
  startTestDB,
  connection,
  stopTestDB,
} from "@/tests/test-utils/setup-test-db";

let factory: IFactory;
let useCase: GetPlansUseCase;

beforeAll(async () => {
  await startTestDB();
  factory = makeFactory(connection);
  useCase = new GetPlansUseCase(factory.repositoryFactory);
}, 30000);

afterAll(async () => {
  await stopTestDB();
});

describe("Get Plans Use Case", () => {
  it("should retrieve plans successfully", async () => {
    const output = await useCase.execute();
    console.log(output);
  });
});
