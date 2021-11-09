import childProcess from "child_process";
import chalk from "chalk";
import { appendFile, existsSync, mkdir } from "fs";
import path from "path";
import shell from "child_process";
const Spinner = require("cli-spinner").Spinner;

export async function initDockerCompose(options) {
  if (options.docker_compose) {
    if (existsSync(`./${options.name}/docker-compose.yml`)) {
      console.error(chalk.red(`exists file docker-compose.yml in directory`));
      return;
    }
    const template = `
    version: "3.7"
    services:
    [name-service]:
    image: [image-name]
    command: sh -c "[command]"
    ports:
      - [PORT DOCKER]:[PORT HOST]
    working_dir: [directory where the project is]
    volumes:
      - [VOLUME DOCKER]:[VOLUME HOST]
    `;
    appendFile(`./${options.name}/docker-compose.yml`, template, (err) => {
      if (err) {
        console.log("It was not possible write file", chalk.red.bold("ERROR"));
        process.exit(1);
      }
    });

    console.log(
      chalk.green.bold("Arquivo docker-compose.yml criado com sucesso!")
    );
  }
}

export async function initGit(options) {
  if (options.git) {
    if (existsSync(`./${options.name}/.git`)) {
      console.log(chalk.red("Already a Git repository!"));
      return;
    }
    childProcess.exec(`cd ./${options.name} && git init`, (err) => {
      if (err) {
        console.log(
          "Houve um erro ao inicializar um repositório GIT",
          chalk.red.bold("ERROR")
        );
        return;
      }
    });
    console.log(chalk.green.bold("Repositório GIT inicializado com sucesso!"));
  }
}

export async function installDenpendencies(options) {
  if (options.run_install) {
    const spinner = new Spinner("Installing dependencies....%s");
    spinner.setSpinnerString("|/-\\");
    spinner.start();
    childProcess.exec(
      `cd ./${options.name} && ${options.installer} install`,
      (err) => {
        if (err) {
          spinner.stop();
          console.log(
            `There was an error in directory ${options.name}`,
            chalk.red.bold("ERROR")
          );
          return;
        }
        spinner.stop();
        console.log(
          `\n${chalk.green.bold("Dependencies installed with sucesso!")}`
        );
      }
    );
  }
}

export default async (options) => {
  await copyTemplate(options);
  await initGit(options);
  await initDockerCompose(options);
  await installDenpendencies(options);
};

async function copyTemplate(options) {
  if (options.template.toUpperCase() === "TYPESCRIPT") {
    if (options.type_project.toUpperCase() === "WEB") {
    } else {
      mkdir(`./${options.name}`, (err) => {
        if (err) {
          console.log(
            `Error to created directory => ${options.name}`,
            chalk.red.bold("ERROR")
          );
          return;
        }
        shell.exec(
          `cp -r ${path.dirname(__dirname)}/templates/backend/typescript/* ./${
            options.name
          }`,
          (err) => {
            if (err) {
              console.log(
                `Error to copied files in directory ${options.name}`,
                chalk.red.bold("ERROR")
              );
              return;
            }
          }
        );
      });
      console.log(chalk.green.bold("Template copied sucesseful!"));
    }
  } else {
  }
}
