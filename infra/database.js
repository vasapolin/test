let Client;

if (typeof window === 'undefined') {
  Client = require('pg').Client;
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Attempting to connect to localhost...');
      client.connectionString = 'postgres://localhost:5432/my_local_db';
      client.connect();
    }
  } else {
    console.log('Connected to database');
  }
});

module.exports = client;
