#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./cmd/init";

export function run() {
  const program = new Command();

  program
    .name("startupkit")
    .description("The last startup framework you'll ever need")
    .version(require("../package.json").version)
    .action(() => {
      // console.log("No command provided. Please specify a command.");
      init();
    });

  program
    .command("help")
    .description("...")
    .action(() => {
      // build();
    });

  program.parse();
}

run();
