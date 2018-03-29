I just made this change to scripts/start.js.

before-

    const devServer = new WebpackDevServer(compiler, serverConfig);
after-

    const devServer = new WebpackDevServer(compiler, {
      ...serverConfig,
      https: true
    });