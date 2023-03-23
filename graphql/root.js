const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} = require('graphql');

const DocType = require("./doc.js");

const docs = require("../models/docsModel.js");

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        doc: {
            type: DocType,
            description: 'A single doc',
            args: {
                name: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                const doc = await docs.getOneDoc(args.name);

                return doc;
            }
        },
        docs: {
            type: new GraphQLList(DocType),
            description: 'List of all docs',
            args: {
                allowed_user: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                const allDocs = await docs.getAllDocs(args.allowed_user);

                return allDocs;
            }
        }
    })
});

module.exports = RootQueryType;