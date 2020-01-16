module.exports = {
    apps : [{
      name: 'Middle-Receiver',
      interpreter: 'babel-node',
      script: './client/app.js',
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production'
      }
    }],

    deploy : {
      production : {
        user : 'ubuntu',
        host : '13.124.141.27',
        key : '/c/Users/sjkwon/.ssh/BOdysseyWebKeyPair.pem',
        ref  : 'origin/master',
        repo : 'git@github.com:BlockOdyssey/Middle-Receiver.git',
        path : '/home/ubuntu/test/',
        'post-deploy' : 'pm2 reload ./client/ecosystem.config.js --env production'
      }
    }
  };
  