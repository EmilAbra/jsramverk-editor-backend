/**
 * Database connection.
 */
 "use strict";

const mongo = require("mongodb").MongoClient;
// const config = require("./config.json");
const dbName = "editor";
const collectionName = "docs";

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://texteditor:${process.env.ATLAS_PASSWORD}@cluster0.cekx6wh.mongodb.net/?retryWrites=true&w=majority`;
        // let dsn = `mongodb://localhost:27017/`;
        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db(dbName);
        const collection = await db.collection(collectionName);
        // console.log(collection);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
