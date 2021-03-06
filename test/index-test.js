import dora from 'dora';
import { join } from 'path';
import request from 'supertest';

const localIP = require('internal-ip')();
const port = '1234';

describe('index', () => {
  describe('weinre', () => {
    const cwd = process.cwd();
    before(done => {
      process.chdir(join(__dirname, './fixtures/normal'));
      dora({
        port,
        plugins: ['dora-plugin-webpack', '../../../src/index?{httpPort:8888}'],
        cwd: join(__dirname, './fixtures/normal'),
      }, done);
    });

    after(() => {
      process.chdir(cwd);
    });

    it('GET weinre /target/target-script-min.js#anonymous', done => {
      request(`http://${localIP}:8888`)
        .get('/target/target-script-min.js#anonymous')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          if (res.text.indexOf("modjewel.require('weinre/target/Target').main()") < 0) {
            const e = new Error('/target/target-script-min.js#anonymous is not correct');

            return done(e);
          }

          return done();
        });
    });

    it('GET /index.html is injected the script /target/target-script-min.js#anonymous', done => {
      request(`http://localhost:${port}`)
        .get('/index.html')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          if (res.text.indexOf('// weinre') < 0) {
            const e = new Error('/target/target-script-min.js#anonymous is not injected');

            return done(e);
          }

          return done();
        });
    });

    it('GET /lackdoctype.html is injected the script livereload.js', done => {
      request(`http://localhost:${port}`)
        .get('/lackdoctype.html')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          if (res.text.indexOf('// weinre') < 0) {
            const e = new Error('/target/target-script-min.js#anonymous is not injected');

            return done(e);
          }

          return done();
        });
    });

    it('GET /index.js should be handled', done => {
      request(`http://localhost:${port}`)
        .get('/index.js')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          if (res.text.indexOf('// weinre') < 0) {
            const e = new Error('other types of files should be handled');

            return done(e);
          }

          return done();
        });
    });
  });
});
