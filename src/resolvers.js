
const { db, getNextId } = require('./data');
const { pubsub } = require('./pubsub')

const resolvers = {
    Subscription: {
        userCreated: {
            subscribe: (_, __) => {
                return pubsub.asyncIterator('userCreated')
            }
        }
    },
    Query: {
        users: () => db.users,
        user: (_, args) => db.users.find(u => u.id === args.id),

        events: () => db.events,
        event: (_, args) => db.events.find(e => e.id === args.id),

        locations: () => db.locations,
        location: (_, args) => db.locations.find(l => l.id === args.id),

        participants: () => db.participants,
        participant: (_, args) => db.participants.find(p => p.id === args.id),
    },
    Participant: {
        user: (p, args) => db.users.find(u => u.id === p.user_id),
        event: (p, args) => db.events.find(e => e.id === p.event_id),
    },
    User: {
        events: (p, args) => db.events.filter(e => e.user_id === p.id)
    },
    Event: {
        location: (p, args) => db.locations.find(l => l.id === p.location_id),
        user: (p, args) => db.users.find(u => u.id === p.user_id),
        pariticipants: (p, args) => {
            const eventId = p.id;
            const participants = db.participants.filter(p => p.event_id === eventId);
            return participants.map(p => db.users.find(u => p.user_id === u.id))
        },
    },
    Mutation: {
        addUser: (parent, { data }) => {
            const user = { ...data, id: getNextId('users') };
            db.users.push(user);
            pubsub.publish('userCreated', { userCreated: user });
            return user;
        },
        updateUser: (parent, { id, data }) => {
            const index = db.users.findIndex(u => u.id === id);
            if (index === -1) {
                throw new Error('user not found')
            }
            const user = db.users[index];
            const newUser = {
                ...user,
                ...data
            };
            db.users[index] = newUser;
            return newUser;
        },
        deleteUser: (parent, { id }) => {
            const index = db.users.findIndex(u => u.id === id);
            if (index === -1) {
                throw new Error('user not found')
            }
            const [user] = db.users.splice(index, 1);
            return user;
        },
        deleteAllUser: (parent) => {
            const count = db.users.length;
            db.users.length = 0;
            return { count };
        },
        addParticipant: (parent, { data }) => {
            const participant = { ...data, id: getNextId('participants') };
            db.participants.push(participant);
            return participant;
        },
        updateParticipant: (parent, { id, data }) => {
            const index = db.participants.findIndex(u => u.id === id);
            if (index === -1) {
                throw new Error('participant not found')
            }
            const participant = db.participants[index];
            const newParticipant = {
                ...participant,
                ...data
            };
            db.participants[index] = newParticipant;
            return newParticipant;
        },
        deleteParticipant: (parent, { id }) => {
            const index = db.participants.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error('participant not found');
            }
            const [participant] = db.participants.splice(index, 1);
            return participant;
        },
        deleteAllParticipant: (parent) => {
            const count = db.participants.length;
            db.participants.length = 0;
            return { count };
        },
        addEvent: (parent, { data }) => {
            const event = { ...data, id: getNextId('events') };
            db.events.push(event);
            return event;
        },
        updateEvent: (parent, { id, data }) => {
            const index = db.events.findIndex(e => e.id === id);
            if (index === -1) {
                throw new Error('event not found')
            }
            const event = db.events[index];
            const newEvents = {
                ...event,
                ...data
            };
            db.events[index] = newEvents;
            return newEvents;
        },
        deleteEvent: (parent, { id }) => {
            const index = db.events.findIndex(u => u.id === id);
            if (index === -1) {
                throw new Error('event not found')
            }
            const [event] = db.events.splice(index, 1);
            return event;
        },
        deleteAllEvent: (parent) => {
            const count = db.events.length;
            db.events.length = 0;
            return { count };
        },
        addLocation: (parent, { data }) => {
            const event = { ...data, id: getNextId('locations') };
            db.locations.push(event);
            return event;
        },
        updateLocation: (parent, { id, data }) => {
            const index = db.locations.findIndex(e => e.id === id);
            if (index === -1) {
                throw new Error('location not found')
            }
            const location = db.locations[index];
            const newLocation = {
                ...location,
                ...data
            };
            db.locations[index] = newLocation;
            return newLocation;
        },
        deleteLocation: (parent, { id }) => {
            const index = db.locations.findIndex(u => u.id === id);
            if (index === -1) {
                throw new Error('location not found')
            }
            const [location] = db.locations.splice(index, 1);
            return location;
        },
        deleteAllLocation: (parent) => {
            const count = db.locations.length;
            db.locations.length = 0;
            return { count };
        },
    }
};


module.exports = { resolvers }