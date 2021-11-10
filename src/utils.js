import childProcess from "child_process";
import chalk from "chalk";
import { appendFile, appendFileSync, existsSync, mkdir } from "fs";
import path from "path";
import shell from "child_process";
const Spinner = require("cli-spinner").Spinner;

export async function initDockerCompose(options) {
  if (options.docker_compose) {
    const template = `
    version: "3.7"
    services:
    [name_service]:
    image: [image_name]
    command: sh -c "[command]"
    ports:
      - [PORT_DOCKER]:[PORT_HOST]
    working_dir: [directory where the project is]
    volumes:
      - [VOLUME_DOCKER]:[VOLUME_HOST]
    `;
    appendFile(`./${options.name}/docker-compose.yml`, template, (err) => {
      if (err) {
        console.log("It was not possible write file", chalk.red.bold("ERROR"));
        process.exit(1);
      }
    });

    console.log(
      chalk.green.bold("docker-compose.yml file created successfully!")
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
          "There was an error initialize a repository GIT",
          chalk.red.bold("ERROR")
        );
        return;
      }
    });
    console.log(
      chalk.green.bold("Repository GIT initialize with successfully!")
    );
  }
}

export async function installDenpendencies(options) {
  if (options.run_install) {
    let i = 0;
    while (i < Array.from(options.type_projects).length) {
      const type = options.type_projects[i].toLowerCase();
      await execInstall(type, options);
      i++;
    }
  }
}

async function execInstall(type, options) {
  return new Promise((resolve) => {
    const spinner = new Spinner(`Installing dependencies on ${type}....%s`);
    spinner.setSpinnerString("|/-\\");
    spinner.start();
    childProcess.exec(
      `cd ./${options.name}/${type} && ${options.installer} install`,
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
          `\n${chalk.green.bold(
            `Dependencies installed with success on ${type}!`
          )}`
        );
        return resolve(true);
      }
    );
  });
}
export default async (options) => {
  await copyTemplate(options);
  await initGit(options);
  await initDockerCompose(options);
  await installDenpendencies(options);
};

async function copyTemplate(options) {
  Array.from(options.type_projects).forEach((type) => {
    if (!existsSync(`./${options.name}`)) {
      mkdir(`./${options.name}`, (err) => {
        if (err) {
          console.log(
            `Error to created directory => ${options.name}`,
            chalk.red.bold("ERROR")
          );
          return;
        }
      });
    }
    Array.from(options.purposes).forEach((purpose) => {
      if (
        existsSync(
          `${path.dirname(__dirname)}/templates/${
            type.toLowerCase() === "web" ? "frontend" : type.toLowerCase()
          }/${purpose.toLowerCase()}/${options.template.toLowerCase()}`
        )
      ) {
        shell.exec(
          `cp -rT ${path.dirname(__dirname)}/templates/${
            type.toLowerCase() === "web" ? "frontend" : type.toLowerCase()
          }/${purpose.toLowerCase()}/${options.template.toLowerCase()} ./${
            options.name
          }/${type.toLowerCase()}`,
          (err) => {
            if (err) {
              console.log(
                `Error to copied files in directory ${options.name}`,
                chalk.red.bold("ERROR")
              );
              return;
            }

            if (options.git) {
              appendFileSync(
                `./${options.name}/${type.toLowerCase()}/.gitignore`,
                `node_modules\nyarn*\n`
              );
            }
          }
        );
      }
    });
  });
  console.log(chalk.green.bold("Template copied successfully!"));
}
