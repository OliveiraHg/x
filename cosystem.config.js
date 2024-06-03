module.exports = {
  apps: [{
    name: 'XNIL API',
    script: 'index.js',
    watch: false,
  }],
  deploy: {
    production: {
      user: 'root',
      host: '139.99.117.29',
      ref: 'origin/master',
      repo: 'git@github.com:Bucky-26/EASY_API_1.git',
      path: 'index.js',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
