#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./cmd/init";
// import { update } from "./cmd/update";
import { add } from "./cmd/add";

export function run() {
  const program = new Command();

  program
    .name("startupkit")
    .description("The Zero to One Startup Framework");

  program
    .command("init")
    .description("Initialize a new project or setup")

    .option("--name <name>", "Name of the app")
    .option("--repo <repo>", "Template repo to use")
    .action((options) => {
      init({ name: options.name, repoArg: options.repo });
    });

  program
    .command("add [type]")
    .description("Add a new app to the apps/ folder")
    .option("--name <name>", "Name of the app")
    .option("--repo <repo>", "Template repo to use")
    .action((type, options) => {
      add({ type, nameArg: options.name, repoArg: options.repo });
    });

  // program
  //   .command("up")
  //   .alias("update")
  //   .alias("upgrade")
  //   .description("Update all startupkit packages to the latest version")
  //   .action(() => {
  //     update();
  //   });

  program
    .command("help")
    .description("Show help information")
    .action(() => {
      program.help();
    });

  // Show help if no command is provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
  }

  program.parse();
}

run();
