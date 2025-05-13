// apollo client setup
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context/index.js';
import supabase from '../config/supabase.js';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || '';
};

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
