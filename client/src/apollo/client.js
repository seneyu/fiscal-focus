// apollo client setup
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions/index.js';
import { getMainDefinition } from '@apollo/client/utilities/index.js';
import { createClient } from 'graphql-ws';

// http link for queries and mutations
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// websocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  })
);

// split link to route operations based on type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // use websocket for subscriptions
  httpLink // use http for queries and mutations
);

// apollo client instance
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
