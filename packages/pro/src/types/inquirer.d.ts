declare module 'inquirer' {
  interface QuestionMap<T = Record<string, unknown>> {
    password: {
      type: 'password';
      name: string;
      message: string;
      validate?: (input: string) => boolean | string;
      mask?: string;
    };
  }

  export interface PromptModule {
    <T extends Record<string, unknown>>(questions: Array<{ type: string } & QuestionMap[keyof QuestionMap]>): Promise<T>;
  }

  const inquirer: {
    prompt: PromptModule;
  };

  export = inquirer;
}
