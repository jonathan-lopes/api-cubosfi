module.exports = {
  apps: [
    {
      name: 'api-cubosfi',
      script: './src/index.js',
      watch: true,
      error_file: './logs/pm2/app-error.log',
      out_file: './logs/pm2/all.log',
      pid_file: `./logs/pm2/pids/app.pid`,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      time: true,
      log_type: 'json',
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
