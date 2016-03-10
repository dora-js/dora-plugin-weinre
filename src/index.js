import { existsSync, readFileSync } from 'fs';
import { parse } from 'url';
import { join } from 'path';

const localIP = require('internal-ip')();

/**
 * weinre code
 * https://git-wip-us.apache.org/repos/asf?p=cordova-weinre.git;a=blob;f=weinre.server/lib/cli.js;h=3c4b50784a538af7fdbb471d56f35e11802ef0f4;hb=cc97191c79ca260b5bbf83b19d5cfc3e02468cac
 */
require('coffee-script');
import { run } from 'weinre';

let defaultOpts = {
  httpPort: 8990,
  boundHost: 'localhost',
  verbose: false,
  debug: false,
  readTimeout: 5,
  deathTimeout: 15,
  help: false,
};

export default {
  'middleware.before'() {
    const { log, query } = this;
    defaultOpts.boundHost = localIP;
    defaultOpts = {...defaultOpts, ...query};

    run(defaultOpts);
    log.info(`weinre is started, servering at http://${defaultOpts.boundHost}:${defaultOpts.httpPort}`);
  },

  'middleware'() {
    const { cwd } = this;

    return function* (next) {
      const fileName = parse(this.url).pathname;
      const filePath = join(cwd, fileName);
      const isHTML = /\.html?$/.test(this.url.split('?')[0]);
      if (isHTML && existsSync(filePath)) {
        const injectScript = `<script src='http://${defaultOpts.boundHost}:${defaultOpts.httpPort}/target/target-script-min.js#anonymous'></script>`;
        let content = readFileSync(filePath, 'utf-8');
        const docTypeReg = new RegExp('^\s*\<\!DOCTYPE\s*.+\>.*$', 'im');
        const docType = content.match(docTypeReg);
        if (docType) {
          content = content.replace(docTypeReg, docType[0] + injectScript);
          this.body = content;

          return;
        }
        content = injectScript + content;
        this.body = content;

        return;
      }
      yield next;
    };
  },
};
