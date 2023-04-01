const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
} = require('graphql');

const CommentType = require("./comment.js");

const DocType = new GraphQLObjectType({
    name: 'Doc',
    description: 'This represents a Document',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        allowed_users: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        codeMode: { type: new GraphQLNonNull(GraphQLBoolean) },
        comments: { type: new GraphQLList(CommentType) }
    })
})

module.exports = DocType;