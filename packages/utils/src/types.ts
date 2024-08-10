export type InitializerQuestion = {
  type: "confirm" | "input" | "checkbox";
  name: string;
  message: string;
  choices?: { name: string; value: string }[];
};

export type InitializerOptions = {
  cwd: string;
};

export type InitializerActions = {
  providers?: string[];
  packages?: string[];
  config?: {
    import: "@startupkit/cms/config";
  };
};

export type InitializerRunner = (
  answers: any,
  opts: InitializerOptions
) => Promise<InitializerActions | void>;

export type Initializer = {
  questions: InitializerQuestion[];
  init: InitializerRunner;
};
