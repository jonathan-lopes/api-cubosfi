module.exports = {
  apps: [
    {
      name: 'api-cubosfi',
      script: './src/index.js',
      watch: true,
      error_file: './logs/error.log',
      out_file: './logs/all.log',
      merge_logs: true,
      instances: 0,
      exec_mode: 'cluster',
      ignore_watch: ['[/\\]./', 'node_modules', 'logs', 'test'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
