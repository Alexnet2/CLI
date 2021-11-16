import arg from "arg";
import inquirer from "inquirer";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import utils from "./utils";

function parseArgumentsIntoOptions(rawArgs) {
  try {
    const args = arg(
      {
        "--git": Boolean,
        "--template": String,
        "--types": String,
        "--purposes": String,
        "--help": Boolean,
        "--connection": String,
        "--plugin": String,
      },
      {
        argv: rawArgs.slice(2),
      }
    );
    return {
      git: args["--git"],
      template: args["--template"] || "",
      name: args._[0],
      type_projects: args["--types"],
      purposes: args["--purposes"],
      help: args["--help"] || false,
      type_connection: args["--connection"],
      plugin_database: args["--plugin"],
    };
  } catch (err) {
    if (String(err).includes("requires")) {
      console.log(chalk.red("Option requires argument"));
    } else {
      console.log(chalk.red("Option not found"));
    }
    return {
      help: true,
      err: true,
    };
  }
}

async function promptForMissingOptions(options) {
  let questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which Template",
      choices: ["Typescript"],
      default: "Typescript",
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

  if (!options.type_projects) {
    answers.type_projects = (
      await inquirer.prompt([
        {
          type: "checkbox",
          name: "type_projects",
          message: "Please choose type project",
          choices: ["Web", "Backend"],
          default: "Backend",
          validate: function (value) {
            if (value.length) {
              return true;
            } else {
              return "You must choose at least one.";
            }
          },
        },
      ])
    ).type_projects;

    let askPurpose = [];

    if (Array.from(answers.type_projects).includes("Web")) {
      askPurpose.push({
        type: "list",
        name: "purpose_web",
        message: "Web - Finality?",
        choices: ["React"],
        default: "React",
      });
    }
    if (Array.from(answers.type_projects).includes("Backend")) {
      askPurpose.push({
        type: "list",
        name: "purpose_node",
        message: "Backend - Finality?",
        choices: ["default", "api-express","api-graphql"],
        default: "default",
      });
    }
    answers.purposes = [];

    const answersPurpose = await inquirer.prompt(askPurpose);
    Object.keys(answersPurpose).forEach((key) => {
      answers.purposes.push(answersPurpose[key]);
    });
  }
  if (!options.run_install) {
    const questions = [];
    if (!options.type_connection) {
      questions.push({
        type: "list",
        name: "type_connection",
        message: "Please choose wich type connection your desire?",
        choices: ["Knex", "TypeOrm"],
        default: ["Knex"],
      });
    }
    if (!options.plugin_database) {
      questions.push({
        type: "list",
        name: "plugin_database",
        message: "Please choose which plugin you will use?",
        choices: ["Postgresql", "Mysql"],
        default: "Postgresql",
      });
    }
    questions.push({
      type: "confirm",
      name: "run_install",
      message: "Install Denpendencies?",
      default: false,
    });

    const answer = await inquirer.prompt(questions);
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
      ).installer;
      answers.run_install = true;
    } else {
      answers.run_install = false;
    }

    answers.type_connection = answer.type_connection;
    answers.plugin_database = answer.plugin_database;
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
    type_projects: options.type_projects || answers.type_projects,
    installer: options.installer || answers.installer,
    purposes: options.purposes || answers.purposes,
    type_connection: options.type_connection || answers.type_connection,
    plugin_database: options.plugin_database || answers.plugin_database,
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
  if (options.help) {
    console.log(
      chalk.red(
        "Create Projects developmented By Alex - GitHub https://github.com/Alexnet2/CLI"
      )
    );

    console.log(chalk.green("Options:"));
    console.log(
      chalk.green(` --git`) + chalk.gray(` initialize a repository GIT`)
    );
    console.log(
      chalk.green(` --template`) +
        chalk.gray(` Typescript`)
    );
    console.log(
      chalk.green(` --types`) +
        chalk.gray(` what type your project will be focused on, web/backend.`) +
        chalk.red("can choose both")
    );
    console.log(
      chalk.green(`         Example: `) + chalk.gray(` --types=web,backend`)
    );

    console.log(
      chalk.green(` --purposes`) +
        chalk.gray(` what purpose your project will be focused on: `)
    );
    console.log(
      chalk.gray(`       Web:
        - React
       Backend:
        - default
        - api-express
        - api-graphql`)
    );
    console.log(
      chalk.green(`  Example: `) + chalk.gray(`--purposes=react,api-express`)
    );
    console.log(chalk.green(` --help`) + chalk.gray(" show help"));
    console.log(
      chalk.green(` --connection`) +
        chalk.gray(` Wich type of connection use will: Knex/TypeOrm.`)
    );
    console.log(
      chalk.green(`         Example: `) + chalk.gray(` --connection=knex`)
    );
    console.log(
      chalk.green(` --plugin`) + chalk.gray(` Wich database: Postgresql/Mysql.`)
    );
    console.log(
      chalk.green(`         Example: `) + chalk.gray(` --plugin=postgresql`)
    );
    return;
  }
  if (!options.name && !options.err) {
    console.error(
      chalk.red.bold("create-projects myproject => To created the project")
    );
    return;
  }
  if (options.purposes && (!options.type_projects || !options.template)) {
    console.error(
      chalk.red.bold(
        "You need selected a template and type of project before continuos"
      )
    );
    return;
  } else if (options.type_projects && !options.template) {
    console.error(
      chalk.red.bold("You need selected a template before continuos")
    );
    return;
  } else {
    if (options.purposes) {
      options.purposes = options.purposes.split(",");
    }
    if (options.type_projects) {
      options.type_projects = options.type_projects.split(",");
    }
  }

  options = await promptForMissingOptions(options);
  await utils(options);
}
