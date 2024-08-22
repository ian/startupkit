#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./cmd/init";
import { update } from "./cmd/update";

export function run() {
  const program = new Command();

  program
    .name("startupkit")
    .description("The Zero to One Startup Framework")
    .action(() => {
      // console.log("No command provided. Please specify a command.");
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
    .command("help")
    .description("...")
    .action(() => {
      // build();
    });

  program.parse();
}

run();
