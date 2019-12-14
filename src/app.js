import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer,PubSub } from "graphql-yoga";
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Partido from './resolvers/Partido'
import Suscription from './resolvers/Suscription'


import "babel-polyfill";

const usr = "adrian";
const pwd = "12345";
const url = "server1-zlr9p.mongodb.net/test?retryWrites=true&w=majority";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};



/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function (context) {
  

  const resolvers = {
    Partido,
    Query,
    Mutation,
    Suscription
    
  };

  
  const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers, context });
  const options = {
    port: 8000
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }

};

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  const pubsub = new PubSub();
  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client,pubsub });
  } catch (e) {
    console.log('Aberestudiao');
    client.close();
  }
};

runApp();