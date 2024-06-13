#! /usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { Command } from "commander";
import fs from "fs-extra";
import {create} from "./module/create.js";

/**
 * @description: 获取logo
 */
function getLogo() {
    return figlet('HaoRan CLI', {
        font: "3D-ASCII",
    }, function(err, data) {
        return Promise.resolve(data||'');
    })
}

/**
 * @description：获取版本号
 */
async function getVersion() {
   const res = await fs.readJson('./package.json')
   return res?.version ||'0.0.0'
}

const logoStr=  await getLogo()
const version = await getVersion();

const program = new Command();

program
    .name('HaoRan CLI')
    .description(logoStr)
    .version(version, '-v, --version',  chalk.blue('查看当前版本号'))
    .helpOption('-h, --help', chalk.yellow('查看帮助信息'))
    .helpCommand('help [command]', chalk.yellow('查看帮助信息'));

program.command('create <name>')
    .description(chalk.green('创建新的工程'))
    .action( (name) => {
        create(name)
    });

program.command('lib')
    .description(chalk.green('相关库推荐'))
    .action(() => {
        console.log('[ 推荐库 ] >', 'react, vue, angular')
    })

program.parse(process.argv);

