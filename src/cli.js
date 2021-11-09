import arg from "arg";
import inquirer from "inquirer";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import utils from "./utils";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--docker-compose": Boolean,
      "--install": Boolean,
      "--template": String,
      "--type": String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    git: args["--git"],
    docker_compose: args["--docker-compose"],
    template: args["--template"] || "",
    name: args._[0],
    run_install: args["--install"],
    type_project: args["--type"],
    installer: args["--installer"],
  };
}

async function promptForMissingOptions(options) {
  let questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which Template",
      choices: ["Javascript", "Typescript"],
      default: "Typescript",
    });
  }
  if (!options.type_project) {
    questions.push({
      type: "list",
      name: "type_project",
      message: "Please choose type project",
      choices: ["Web", "Node"],
      default: "Node",
    });
  }
  if (!options.docker_compose) {
    questions.push({
      type: "confirm",
      name: "docker_compose",
      message: "Create a docker-compose file?",
      default: false,
    });
  }
  let answers = await inquirer.prompt(questions);

  if (!options.run_install) {
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "run_install",
        message: "Install Denpendencies?",
        default: false,
      },
    ]);

    if (answer.run_install) {
      answers.installer = (
        await inquirer.prompt([
          {
            type: "list",
            name: "installer",
            message: "Please choose which Installer",
            choices: ["npm", "yarn"],
            default: "npm",
          },
        ])
      ).installer
      answers.run_install = true;
    } else {
      answers.run_install = false;
    }
  }

  if (!options.git) {
    const askGitHub = [
      {
        name: "repository",
        type: "input",
        message: "Please inform repository`s name:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter with repository`s name";
          }
        },
      },
      {
        name: "username",
        type: "input",
        message: "Enter your GitHub username or address E-mail:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your GitHub username or address E-mail";
          }
        },
      },
      {
        name: "password",
        type: "password",
        message: "Enter your Password:",
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your Password";
          }
        },
      },
    ];

    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "git",
        message: "Initialize a git repository?",
        default: false,
      },
    ]);

    if (answer.git) {
      answers.git = true;
    } else {
      answers.git = false;
    }
  }

  return {
    ...options,
    template: answers.template || options.template,
    git: options.git || answers.git,
    docker_compose: options.docker_compose || answers.docker_compose,
    run_install: options.run_install || answers.run_install,
    type_project: options.type_project || answers.type_project,
    installer: options.installer || answers.installer,
  };
}

export async function cli(args) {
  clear({
    fullClear: true,
  });

  console.log(
    chalk.green(
      figlet.textSync("Create Projects", {
        horizontalLayout: "universal smushing",
      })
    )
  );
  let options = parseArgumentsIntoOptions(args);
  if (!options.name) {
    console.error(
      chalk.red.bold("create-projects myproject => To created the project")
    );
    return;
  }
  options = await promptForMissingOptions(options);
  await utils(options);
}
