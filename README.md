# geolocation-plugin [![npm version](https://badge.fury.io/js/%40glints%2Fhapi-geolocation-plugin.svg)](https://badge.fury.io/js/%40glints%2Fhapi-geolocation-plugin)

This plugin resolves the client's location using Maxmind's GeoIP databases.

# Usage Instructions

To integrate this into your project, install the package:

```
npm install --save @glints/hapi-geolocation-plugin  # If using npm
yarn add @glints/hapi-geolocation-plugin            # If using Yarn
```

Then register the plugin with hapi:

```js
import { GeolocationPlugin } from '@glints/hapi-geolocation-plugin';

// Register the plugin with the hapi server.
await hapiServer.register({
  plugin: GeolocationPlugin,
  options: {
    // Downloadable at https://dev.maxmind.com/geoip/geoip2/geolite2/
    dbPath: 'GeoLite2-Country.mmdb',
  },
});
```

# Contribution Guidelines

We use [EditorConfig](https://editorconfig.org) to maintain consistent line-ending and indentation rules across all our projects. Ensure that you have the appropriate plugin installed in your preferred editor, or refer to `.editorconfig`.

# About Glints

Glints is an online talent recruitment and career discovery platform headquartered in Singapore. It is a platform for young talent to build up their career readiness through internships and graduate jobs; developing skill sets required in different careers.

**P.S.** We deal with quite a number of interesting engineering problems centered on matching the right talent to employers. Sounds interesting? Send your resume to tech@glints.com.
