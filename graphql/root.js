const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
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
                id: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                const doc = await docs.getOneDoc(args.id);

                return doc;
            }
        },
        docs: {
            type: new GraphQLList(DocType),
            description: 'List of all docs',
            resolve: async function() {
                const allDocs = await docs.getAllDocs();

                return allDocs;
            }
        }
    })
});

module.exports = RootQueryType;