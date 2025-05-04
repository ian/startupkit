#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./cmd/init";
import { update } from "./cmd/update";
import { add } from "./cmd/add";

export function run() {
  const program = new Command();

  program
    .name("startupkit")
    .description("The Zero to One Startup Framework");

  program
    .command("init")
    .description("Initialize a new project or setup")
    .action(() => {
      init();
    });

  program
    .command("up")
    .alias("update")
    .alias("upgrade")
    .description("Update all startupkit packages to the latest version")
    .action(() => {
      update();
    });

  program
    .command("add [type] [name]")
    .description("Add a new app to the apps/ folder")
    .action((type, name) => {
      add(type, name);
    });

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
