/**
 * Mongo DB database connection.
 */
"use strict";

const mongo = require("mongodb").MongoClient;
// const dbName = "editor";

const database = {
    getDb: async function getDb(collectionName = "docs") {
        // const dsn = `mongodb+srv://texteditor:${process.env.ATLAS_PASSWORD}@cluster0.cekx6wh.mongodb.net/?retryWrites=true&w=majority`;
        let dsn;
        let dbName; 
        if (process.env.NODE_ENV === 'test') {
            dbName = "test";
            dsn = "mongodb://localhost:27017/test";
        } else {
            dbName = "editor";
            dsn = `mongodb://localhost:27017/${dbName}`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db(dbName);
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
