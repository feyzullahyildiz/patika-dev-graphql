const { gql } = require('apollo-server-express');
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

  type Count {
      count: Int!
  }

  input inputAddUser {
    username: String!
    email: String!
  }
  input inputEditUser {
    username: String
    email: String
  }

  input inputAddParticipant {
    user_id: Int!
    event_id: Int!
  }

  input inputUpdateParticipant {
    user_id: Int
    event_id: Int
  }

  input inputAddEvent {
    title: String!
    desc: String!
    date: String!
    from: String!
    location_id: Int!
    user_id: Int!
  }
  input inputUpdateEvent {
    title: String
    desc: String
    date: String
    from: String
    location_id: Int
    user_id: Int
  }

  input inputAddLocation {
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  input inputUpdateLocation {
    name: String
    desc: String
    lat: Float
    lng: Float
  }


  type Mutation {
      addUser(data: inputAddUser!): User!
      updateUser(id: Int!, data: inputEditUser!): User!
      deleteUser(id: Int!): User!
      deleteAllUser: Count!


      addParticipant(data: inputAddParticipant): Participant!
      updateParticipant(id: Int!, data: inputUpdateParticipant): Participant!
      deleteParticipant(id: Int!): Participant!
      deleteAllParticipant: Count!


      addEvent(data: inputAddEvent): Event!
      updateEvent(id: Int!, data: inputUpdateEvent): Event!
      deleteEvent(id: Int!): Event!
      deleteAllEvent: Count!


      addLocation(data: inputAddLocation): Location!
      updateLocation(id: Int!, data: inputUpdateLocation): Location!
      deleteLocation(id: Int!): Location!
      deleteAllLocation: Count!



      
  }
  type Subscription {
    userCreated: User!
  }

`;

module.exports = { typeDefs }