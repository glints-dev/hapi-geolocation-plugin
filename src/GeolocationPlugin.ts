import * as Hapi from '@hapi/hapi';
import * as Maxmind from 'maxmind';

export interface GeolocationPluginOptions {
  dbPath: string;
}

export interface GeolocationPluginRequestState {
  country?: string;
}

interface GeolocationPluginProperties {
  reader: Maxmind.Reader<Maxmind.CountryResponse>;
}

declare module '@hapi/hapi' {
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

const GeolocationPlugin: Hapi.Plugin<GeolocationPluginOptions> & Hapi.PluginNameVersion = {
  name: 'GeolocationPlugin',
  register: async (server, options) => {
    // Open the country database from Maxmind.
    // Can be downloaded from: https://dev.maxmind.com/geoip/geoip2/geolite2/
    const reader = await Maxmind.open(options.dbPath);
    server.expose('reader', reader);

    // Set the discovered country property.
    server.ext('onRequest', async (request, h) => {
      const reader = request.server.plugins.GeolocationPlugin.reader;
      const response = reader.get(request.info.remoteAddress);
      request.plugins.GeolocationPlugin = {
        country: response?.country?.iso_code,
      };
      return h.continue;
    });
  },
};

export default GeolocationPlugin;
