module.exports = {
  apps: [
    {
      name: 'api-cubosfi',
      script: './src/index.js',
      watch: true,
      error_file: '/dev/null',
      out_file: '/dev/null',
      instances: 0,
      exec_mode: 'cluster',
      ignore_watch: ['[/\\]./', 'node_modules', 'logs', 'test'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
