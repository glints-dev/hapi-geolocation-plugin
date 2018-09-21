import * as Hapi from 'hapi';
import { get } from 'lodash';
import * as Maxmind from 'maxmind';

export interface GeolocationPluginOptions {
  dbPath: string;
}

export interface GeolocationPluginRequestState {
  country: string;
}

interface GeolocationPluginProperties {
  reader: Maxmind.Reader;
}

declare module 'hapi' {
  interface PluginsListRegistered {
    GeolocationPlugin: Hapi.PluginRegistered;
  }

  interface PluginsStates {
    GeolocationPlugin?: GeolocationPluginRequestState;
  }

  interface PluginProperties {
    GeolocationPlugin: GeolocationPluginProperties;
  }
}

const GeolocationPlugin: Hapi.Plugin<GeolocationPluginOptions> = {
  name: 'GeolocationPlugin',
  register: async (server, options) => {
    // Open the country database from Maxmind.
    // Can be downloaded from: https://dev.maxmind.com/geoip/geoip2/geolite2/
    const reader = await new Promise<Maxmind.Reader>((resolve, reject) => {
      Maxmind.open(options.dbPath, (err, reader) => {
        if (err) {
          reject(err);
        } else {
          resolve(reader);
        }
      });
    });

    server.expose('reader', reader);

    // Set the discovered country property.
    server.ext('onRequest', async (request, h) => {
      const reader = request.server.plugins.GeolocationPlugin.reader;
      const response = reader.get(request.info.remoteAddress);
      request.plugins.GeolocationPlugin = {
        country: get(response, 'country.iso_code'),
      };
      return h.continue;
    });
  },
};

export default GeolocationPlugin;
