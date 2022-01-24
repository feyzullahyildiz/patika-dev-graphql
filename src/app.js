
const http = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDefs } = require('./typedefs');
const { resolvers } = require('./resolvers');
const { ApolloServer,  } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const express = require('express');


/**
 * 
 * @param {express.Application} app 
 * @returns 
 */
const getServer = async (app) => {

    const httpServer = http.createServer(app);
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const subscriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: '/graphql' }
    );

    const server = new ApolloServer({
        schema,
        plugins: [
            new ApolloServerPluginLandingPageGraphQLPlayground(),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subscriptionServer.close();
                        }
                    };
                }
            }],
    });
    await server.start();
    server.applyMiddleware({ app });


    return {
        httpServer,
        server,
    }
}


module.exports = {
    getServer
}