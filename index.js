var proxyChecker = require('proxy-checker');
var chalk = require('chalk');
let fs = require('fs');
const ProgressBar = require('progress')
const readline = require('readline');
var linesCount = 0;
var working = 0;
var dead = 0;
const { exec } = require('child_process');
const path = './proxy.txt'
exec('title Marcos Heiman - Proxy Checker');
fs.access(path, fs.F_OK, (err) => {
    if (err) {
        console.log(chalk.red('Missing file: ' + chalk.cyan('proxy.txt')));
        exec('pause');
        return;
    }
var rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false
});
rl.on('line', function (line) {
    linesCount++; // on each linebreak, add +1 to 'linesCount'
});
rl.on('close', function () {
    exec(`title Marcos Heiman Proxy Checker - ${linesCount} Proxys Loaded`);
});
  
console.log(chalk.yellow("----CHECKING----PROXIES----"));
fs.writeFileSync('./working-proxy.txt', '===MARCOS===HEIMAN===', (err) => {
    if(err) return console.log(err);
});
proxyChecker.checkProxiesFromFile(
    // The path to the file containing proxies
    './proxy.txt',
    {
        // the complete URL to check the proxy
        url: 'http://www.google.com'
    },
    // Callback function to be called after the check
    function(host, port, ok, statusCode, err) {
        let data = '';
        if(statusCode == 200){
            working++;
            console.log(chalk.green(`${host}:${port} - Alive`));
            var contents = fs.readFileSync('./working-proxy.txt', 'utf8');
            contents += `\n${host}:${port}`;
            linesCount--;
            fs.writeFile('./working-proxy.txt', contents, (err) => {
                if(err) return console.log(err);
            });
        }else{
            dead++;
            linesCount--;
            console.log(chalk.red(`${host}:${port} - Dead`)); 
        }
        exec(`title Marcos Heiman Proxy Checker - Unchecked: ${linesCount} - Alive: ${working} - Dead: ${dead}`);
    }
);
});
