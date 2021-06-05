import { ApolloServer, gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';

interface ContentQuery {
  contents(): Content[];
}

interface Content {
  id: string;
  title?: string;
  year?: string;
}

interface Query extends ContentQuery {
  me(): User;
}

export interface User {
  id: string;
  name?: string;
  birthDate?: string;
  username?: string;
}

const typeDefs = gql`
  extend type Query {
    me: User
  }
  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
  },
  User: {
    __resolveReference(user: User) {
      return users.find(u => u.id === user.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Accounts service ready at ${url}`);
});

const users: User[] = [
  {
    id: '1',
    name: 'Ada Lovelace',
    birthDate: '1815-12-10',
    username: '@ada',
  },
  {
    id: '2',
    name: 'Alan Turing',
    birthDate: '1912-06-23',
    username: '@complete',
  },
];
