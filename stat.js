const { promises: fsPromises } = require('fs'),
    { join } = require('path'),
    { version } = require('./package.json');

const DIST_DIR = join(__dirname, 'dist');

console.log(`# dist info (v${version})\n`);

fsPromises.readdir(DIST_DIR)
    .then(files => files.reduce(
        (prevPromise, fileName) => prevPromise.then(async () => {
            const file = join(DIST_DIR, fileName),
                size = (await fsPromises.stat(file)).size / 1024,
                info = [
                    (fileName + ' ').padEnd(30, '.'),
                    size.toFixed(3).toString().padStart(7),
                    'KB'
                ].join(' ');
            console.log(info);
        }),
        Promise.resolve()
    ));
