import 'mocha';

import * as assert from 'assert';
import * as path from 'path';

import * as Hapi from '@hapi/hapi';
import * as Sinon from 'sinon';

import GeolocationPlugin from './GeolocationPlugin';

describe('GeolocationPlugin', () => {
  let server: Hapi.Server;
  let spy: Sinon.SinonSpy<[any, Hapi.ResponseToolkit]>;

  const pluginOptions = {
    dbPath: path.join(__dirname, '../geolite2/GeoLite2-Country.mmdb'),
  };

  before(() => {
    spy = Sinon.spy((request: any, h: Hapi.ResponseToolkit) => h.continue);
  });

  beforeEach(() => {
    server = new Hapi.Server();
    server.route({
      method: '*',
      path: '/{p*}',
      handler: spy,
    });
  });

  afterEach(() => {
    spy.resetHistory();
  });

  const registerPluginWithDefaultOptions = (server: Hapi.Server) =>
    server.register({
      plugin: GeolocationPlugin,
      options: pluginOptions,
    });

  it('should be registered', async () => {
    await registerPluginWithDefaultOptions(server);
    assert.ok((server.registrations as any)[GeolocationPlugin.name]);
  });

  describe('Plugin Functionality', () => {
    it('should set country ISO code in request.plugins.GeolocationPlugin', async () => {
      await registerPluginWithDefaultOptions(server);
      await server.inject({
        url: '/',
        remoteAddress: '163.44.201.2',
      });

      const request = spy.args[0][0] as Hapi.Request;
      assert.strictEqual(request.plugins.GeolocationPlugin?.country, 'SG');
    });

    it('should set undefined in request.plugins.GeoLocationPlugin if IP not found', async () => {
      await registerPluginWithDefaultOptions(server);
      await server.inject({
        url: '/',
        remoteAddress: '127.0.0.1',
      });

      const request = spy.args[0][0] as Hapi.Request;
      assert.strictEqual(request.plugins.GeolocationPlugin?.country, undefined);
    });
  });
});
