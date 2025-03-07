import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { typeDefs } from './src/schema/typeDefs.js';
import resolvers from './src/schema/resolvers.js';
import cors from 'cors';
import expenseController from './src/controllers/expenseController.js';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({ typeDefs, resolvers });

// configure middleware for rest api
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:4000',
      'https://studio.apollographql.com',
      'http://localhost:8080',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// app.post('/api/expenses', expenseController.createExpense, (_req, res) => {
//   res.status(201).json(res.locals.expense);
// });

// websocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// hand in the schema to webscoket server
const serverCleanup = useServer({ schema }, wsServer);

// configure graphql server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // proper shutdown for the websocket server
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

// apply graphQL middleware
app.use(
  '/graphql',
  cors({
    origin: [
      'http://localhost:4000',
      'https://studio.apollographql.com',
      'http://localhost:8080',
    ],
    credentials: true, // allows server to acccept credentials from cross-origin requests
  }),
  express.json(),
  expressMiddleware(server)
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`REST API ready at http://localhost:4000/api`);
console.log(`Server ready at http://localhost:4000/graphql`);
console.log(`Subscriptions ready at ws://localhost:4000/graphql`);
