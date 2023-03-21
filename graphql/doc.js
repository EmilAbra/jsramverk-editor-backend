const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const DocType = new GraphQLObjectType({
    name: 'Doc',
    description: 'This represents a Document',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        allowed_users: { type: new GraphQLList(GraphQLString) },
    })
})

module.exports = DocType;