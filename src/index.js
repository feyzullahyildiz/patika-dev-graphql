const express = require('express');
const { getServer } = require("./app");


const start = async () => {
    const app = express();
    const { server, httpServer } = await getServer(app)
    const PORT = process.env.PORT || 4000;
    httpServer.listen(4000, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    })
}

start();

