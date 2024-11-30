module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel', // Keep this plugin if you're using NativeWind
      // Remove the react-native-dotenv plugin configuration
    ],
  };
};
