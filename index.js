const { ApolloServer, gql } = require('apollo-server');

const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { data } = require('./data');


const typeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    events: [Event]
  }
  
  type Event {
    id: Int!
    title: String!
    desc: String!
    date: String!
    from: String!
    location_id: Int!
    user_id: Int!
    user: User!

    location: Location!

    pariticipants: [User!]
  }

  type Location {
    id: Int!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  type Participant {
    id: Int!
    user_id: Int!
    user: User!
    event_id: Int!
    event: Event!
  }

  type Query {

    # User
    users: [User!]
    user(id: Int!): User

    events: [Event!]
    event(id: Int!): Event

    locations: [Location!]
    location(id: Int!): Location

    # Participant
    participants: [Participant!]
    participant(id: Int!): Participant

  }
`;


const resolvers = {
    Query: {
        users: () => data.users,
        user: (_, args) => data.users.find(u => u.id === args.id),

        events: () => data.events,
        event: (_, args) => data.events.find(e => e.id === args.id),

        locations: () => data.locations,
        location: (_, args) => data.locations.find(l => l.id === args.id),

        participants: () => data.participants,
        participant: (_, args) => data.participants.find(p => p.id === args.id),
    },
    Participant: {
        user: (p, args) => data.users.find(u => u.id === p.user_id),
        event: (p, args) => data.events.find(e => e.id === p.event_id),
    },
    User: {
        events: (p, args) => data.events.filter(e => e.user_id === p.id)
    },
    Event: {
        location: (p, args) => data.locations.find(l => l.id === p.location_id),
        user: (p, args) => data.users.find(u => u.id === p.user_id),
        pariticipants: (p, args) => {
            const eventId = p.id;
            const participants = data.participants.filter(p => p.event_id === eventId);
            return participants.map(p => data.users.find(u => p.user_id === u.id))
            // return participants.map(p => data.users.find(u => p.user_id === u.id))

        },
    }
};


const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
