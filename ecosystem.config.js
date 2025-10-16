module.exports = {
  apps: [
    {
      name: "my-next-app",
      exec_mode: "fork", // ensures only one instance
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000", // specify port (optional but good)
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
