const phpServer = require('php-server');
 
(async () => {
    const server = await phpServer({
        port: process.env.PORT || 8080,
    });
    console.log(`PHP server running at ${server.url}`)
})();
