import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const EVENTS = {
  EXPENSE_ADDED: 'EXPENSE_ADDED',
};
