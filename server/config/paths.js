const paths = require("path");

const setupPath = (rootPath) => {
    const alias = {
        "@": paths.join(rootPath)
    };

    return {
        alias,
        resolve: {
            alias
        }
    };
};

module.exports = setupPath;