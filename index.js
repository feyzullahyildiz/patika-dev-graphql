const { GraphQLServer } = require('graphql-yoga')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { typeDefs, resolvers } = require('./app');

const server = new GraphQLServer({
    typeDefs, resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
});

const PORT = process.env.PORT || 4000;
server.start({ port: PORT }).then((res) => {
    console.log(`🚀 Server ready`);
});
