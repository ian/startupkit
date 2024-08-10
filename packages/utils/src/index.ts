import { QuestionMap } from "inquirer";

export type InitializerQuestion = {
  type: "confirm" | "input" | "checkbox";
  name: string;
  message: string;
  choices?: { name: string; value: string }[];
};

export type InitializerRunner = (answers: any) => Promise<void>;

export type Initializer = {
  questions: InitializerQuestion[];
  init: InitializerRunner;
};
