import { existsSync, readFileSync } from 'fs';
import { parse } from 'url';
import { join } from 'path';

import { getInjectWeinreContent } from './util';
import InjectScript from './injectScript';

const localIP = require('internal-ip')();

/**
 * weinre code
 * https://git-wip-us.apache.org/repos/asf?p=cordova-weinre.git;a=blob;f=weinre.server/lib/cli.js;h=3c4b50784a538af7fdbb471d56f35e11802ef0f4;hb=cc97191c79ca260b5bbf83b19d5cfc3e02468cac
 */
require('coffee-script');
import { run } from 'weinre';

let defaultOpts = {
  httpPort: 8990,
  boundHost: localIP,
  verbose: false,
  debug: false,
  readTimeout: 5,
  deathTimeout: 15,
  help: false,
};

export default {
  name: 'dora-plugin-weinre',

  'middleware.before'() {
    const { log } = this;
    run(defaultOpts);
    log.info(`weinre is started, servering at http://${defaultOpts.boundHost}:${defaultOpts.httpPort}`);
  },

  'middleware'() {
    const { cwd, get } = this;

    const compiler = get('compiler');
    if (!compiler) {
      throw new Error('[error] must used together with dora-plugin-webpack');
    }
    return function* middleFunc(next) {
      const pathName = parse(this.url).pathname;
      const fileName = pathName === '/' ? 'index.html' : pathName;
      const filePath = join(cwd, fileName);
      const isHTML = /\.html?$/.test(fileName);
      if (isHTML && existsSync(filePath)) {
        const injectContent = getInjectWeinreContent(defaultOpts.boundHost, defaultOpts.httpPort);
        const injectScript = `<script>${injectContent}</script>`;
        let content = readFileSync(filePath, 'utf-8');
        content = injectScript + content;
        this.body = content;

        return;
      }
      yield next;
    };
  },

  'webpack.updateConfig.finally'(webpackConfig) {
    const { query } = this;

    defaultOpts = { ...defaultOpts, ...query };

    webpackConfig.plugins.push(new InjectScript({
      boundHost: defaultOpts.boundHost,
      httpPort: defaultOpts.httpPort,
    }));

    return webpackConfig;
  },
};
