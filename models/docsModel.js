/**
 * Model to get data for editor from MongoDb database.
 */
 "use strict";

const database = require('../db/database');
const ObjectId = require('mongodb').ObjectId;

const docs = {
    getAllDocs: async function getAllDocs(email) {

        let db;
        try {
            db = await database.getDb();
            const allDocs = await db.collection.find({ allowed_users: email}).toArray();
            return allDocs;
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    },

    getOneDoc: async function getOneDoc(name) {
        let db;
        try {
            db = await database.getDb();

            const filter = { name: name };
            const keyObject = await db.collection.findOne(filter);

            if (keyObject) {
                return keyObject;
            }
        } catch (error) {
            return {
                errors: {
                    message: error.message,
                }
            };
        } finally {
            await db.client.close();
        }
    },

    insertDoc: async function insertDoc(newDoc) {
        let db;
        try {
            db = await database.getDb();

            const result = await db.collection.insertOne(newDoc);
            return {
                ...newDoc,
                _id: result.insertedId
            };
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },

    updateDoc: async function updateDoc(body) {
        let db;
        try {
            db = await database.getDb();
            const filter = { _id: ObjectId(body["_id"]) };

            const updateDocument = {
                name: body.name,
                codeMode: body.codeMode,
                content: body.content,
                allowed_users: body.allowed_users,
                comments: body.comments
            };
            const result = await db.collection.updateOne(
                filter,
                { $set: updateDocument },
            );
            return result;
        } catch (error) {
            console.error(error.message);
        } finally {
            await db.client.close();
        }
    },
};

module.exports = docs;
