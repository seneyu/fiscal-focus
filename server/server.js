import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { typeDefs } from './src/schema/typeDefs.js';
import resolvers from './src/schema/resolvers.js';
import cors from 'cors';
import expenseController from './src/controllers/expenseController.js';

const app = express();
const httpServer = http.createServer(app);

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

app.post('/api/expenses', expenseController.createExpense, (_req, res) => {
  res.status(201).json(res.locals.expense);
});

// app.get('/api/expenses', (req, res) => {
//   res.status(200);
// });

// app.get('api/expenses/:id', (req, res) => {
//   res.status(200);
// });

// configure graphql server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

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
