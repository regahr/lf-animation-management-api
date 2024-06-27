import { createSchema } from "graphql-yoga";
import { GraphQLContext } from "./context";
import { Util } from "./util";

const typeDefinitions = /* GraphQL */ `
  type Query {
    getAnimation(filter: String, skip: Int, take: Int): [Animation!]
  }
  type Animation {
    id: ID!
    name: String!
  }
  type Mutation {
    uploadAnimation(name: String!): Animation!
  }
`;

type Animation = {
  id: string;
  name: string;
};

const resolvers = {
  Query: {
    getAnimation: (
      _parent: unknown,
      args: { filter: string; skip: number; take: number },
      context: GraphQLContext
    ) => {
      const where = args.filter
        ? {
            OR: [{ name: { contains: args.filter } }],
          }
        : {};
      const take = Util.applyTakeConstraints({
        min: 1,
        max: 50,
        value: args.take ?? 30,
      });
      const skip = Util.applySkipConstraints({
        min: 0,
        value: args.skip ?? 0,
      });
      return context.prisma.animation.findMany({
        where,
        take,
        skip,
      });
    },
  },
  Mutation: {
    async uploadAnimation(
      _parent: unknown,
      args: { name: string },
      context: GraphQLContext
    ) {
      const newAnimation = await context.prisma.animation.create({
        data: {
          name: args.name,
        },
      });
      return newAnimation;
    },
  },
  Animation: {
    id: (parent: Animation) => parent.id,
    name: (parent: Animation) => parent.name,
  },
};

export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
