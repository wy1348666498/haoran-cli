import inquirer from 'inquirer';
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import download from "download-git-repo";
import {getOnlineData} from "../utils/index.js";

export async function create(name,globalConfig){
    // 当前命令行执行的目录
    const cwd  = process.cwd();
    // 需要创建的目录
    const targetPath  = path.join(cwd, name)

    // 目录是否存在
    if (fs.existsSync(targetPath)) {
        console.log(chalk.red('目录已经存在'))
        return
    }
    const spinnerOnline = ora(chalk.green('获取线上模板信息'));
    spinnerOnline.start();
    const templateList = await getOnlineData('templateList')
    if(templateList?.length){
        spinnerOnline.succeed(chalk.green('线上模板信息获取成功'));
    } else {
        spinnerOnline.fail(chalk.red('未找到线上模板数据'));
        return
    }

    try {
        const answers = await  inquirer.prompt([
            {
                type:'list', // 选择框
                name:'check',
                message:'请选择要下载的模板',
                default: 0, // 对应的是list 的顺序（索引，从0开始）
                choices: templateList
            },
        ])
        const {url} = templateList.find(item => item.value === answers.check)
        const spinner = ora(chalk.green('模板开始下载...'));
        spinner.start();
         download(url,targetPath, {clone:true}, (err) => {
             if (err) {
                 spinner.fail(chalk.red('[ 模板下载失败 ]'))
             } else {
                 // 下载成功后修改package.json的name
                 const pkgPath = path.join(targetPath, 'package.json')
                 const pkgContent = fs.readJsonSync(pkgPath)
                 pkgContent.name = name
                 fs.writeJsonSync(pkgPath, pkgContent, {spaces: 4})
                 spinner.succeed(chalk.green('[ 模板下载成功 ]'))
             }
         })

    } catch (e) {
        console.log(e)
    }
}
