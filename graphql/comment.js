const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql');

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'This represents a Comment',
  fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      date: { type: new GraphQLNonNull(GraphQLString) },
      user: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      range: { type: new GraphQLList(GraphQLInt) },
  })
})

module.exports = CommentType;