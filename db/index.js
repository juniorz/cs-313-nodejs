"use strict";

// See: https://node-postgres.com/features/pooling#single-query
const { Pool } = require("pg");

//
// local development
// $ psql -h localhost -p 5432 -d postgres -U postgres -W -a -f db/myDb.sql
//

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
    || "postgres://postgres:secret@postgres:5432/family_budget",
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

module.exports = pool;