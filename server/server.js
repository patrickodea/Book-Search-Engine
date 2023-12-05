const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const {typeDefs, resolvers} = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
//setup graphql apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const ServerOfApollo = async () => {
  //needed to start apollo asynchronously before doing anything else
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //the main route apolloserver will use for queries/mutations, as middleware
  //will use authMiddleware as context, which will decode any attached jwt token in the req object or header
  //each query/mutation resolver will then have access to the jwt token contents as a context argument
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  
  //dont need to use these routes anymore as we converted the app from RESTful to graphql
  //app.use(routes);

  //connect to mongodb and start express server
  db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

ServerOfApollo();
