import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  // This app sits inside the Leash monorepo; without this Next walks up past the
  // repo and picks a lockfile from the home directory as the workspace root.
  outputFileTracingRoot: __dirname,

  /**
   * `wagmi/connectors` has no subpath exports, so importing `injected` pulls the
   * whole barrel: the Base Account connector wants `@x402/*`, the MetaMask SDK
   * wants React Native's async-storage, and WalletConnect's logger wants
   * `pino-pretty`. This app only ever instantiates `injected()`, so none of that
   * code is reachable. Ignoring the requests keeps the dead branches out of the
   * bundle instead of installing packages solely to satisfy a barrel import.
   */
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(@x402\/|@react-native-async-storage\/|pino-pretty$)/,
      }),
    );
    return config;
  },
};

export default nextConfig;
