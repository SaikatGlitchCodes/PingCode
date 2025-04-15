const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for aliases
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    '~': __dirname
  }
};

module.exports = withNativeWind(config, { input: './global.css' });