module.exports = {
  apps: [
    {
      name: 'shirt-shop',
      script: 'node_modules/.bin/next',
      args: 'start -p 3013',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
