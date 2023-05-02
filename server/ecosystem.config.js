module.exports = {
    apps: [
        {
            name: "ugram-backend",
            script: "./server.js",
            ignore_watch: ["data", ".git", "node_modules"],
            watch: true,
            env: {
                PORT: 3030,
                NODE_ENV: "development"
            }
        }
    ]
};
