import { createSchema } from "graphql-yoga";
import { GraphQLContext } from "./context";
import { Animation } from "@prisma/client";
import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import { applySkipConstraints, applyTakeConstraints } from "./util";
import path from "path";
import JSZip from "jszip";
import { DotLottieMetadata, JsonLottieAnimation } from "./type";

const typeDefinitions = /* GraphQL */ `
  scalar File
  type Query {
    getAnimation(filter: String, skip: Int, take: Int): [Animation!]
  }
  type Animation {
    id: ID!
    name: String!
    content: Content!
    metadata: Metadata
    createdAt: String!
  }

  type Metadata {
    id: ID!
    version: String
    revision: String
    keywords: String
    author: String
    generator: String
    animation: Animation!
  }

  type Content {
    id: ID!
    filename: String!
    filetype: String!
    content: String!
    metadata: String
    animation: Animation!
  }

  type Mutation {
    uploadAnimation(file: File!): Animation!
  }
`;

const resolvers = {
  Query: {
    getAnimation: (
      _parent: unknown,
      args: { filter: string; skip: number; take: number },
      context: GraphQLContext
    ) => {
      const where = args.filter
        ? {
            OR: [
              { name: { contains: args.filter } },
              { metadata: { author: { contains: args.filter } } },
              { metadata: { keywords: { contains: args.filter } } },
            ],
          }
        : {};
      const take = applyTakeConstraints({
        min: 1,
        max: 50,
        value: args.take ?? 30,
      });
      const skip = applySkipConstraints({
        min: 0,
        value: args.skip ?? 0,
      });
      return context.prisma.animation.findMany({
        where,
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        take,
        skip,
      });
    },
  },
  Mutation: {
    async uploadAnimation(
      _parent: unknown,
      { name, file }: { name: string; file: File },
      context: GraphQLContext
    ) {
      try {
        const fileExtension = path.extname(file.name);
        let name: string = file.name;
        if (!fileExtension)
          throw new GraphQLError(
            `Animation: ${name}' failed to be uploaded, please only upload .lottie / .json file`
          );
        if (![".lottie", ".json"].includes(fileExtension.toLowerCase())) {
          throw new GraphQLError(
            `Animation: ${name}' failed to be uploaded, please only upload .lottie / .json file`
          );
        }

        let dotLottieMetadata: DotLottieMetadata = null;
        let jsonLottieAnimation: JsonLottieAnimation = null;
        let jsonLottieText = null;
        let dotLottieMetadataText = null;
        if (file && file.name.endsWith(".lottie")) {
          try {
            const fileArrayBuffer = await file.arrayBuffer();

            const zip = await JSZip.loadAsync(fileArrayBuffer);
            const manifestFile = zip.file("manifest.json");

            if (!manifestFile) {
              throw new GraphQLError(
                `manifest.json not found in the .lottie file.`
              );
            }

            dotLottieMetadataText = await manifestFile.async("text");
            dotLottieMetadata = JSON.parse(dotLottieMetadataText);
            if (
              !dotLottieMetadata?.animations ||
              (dotLottieMetadata?.animations &&
                !dotLottieMetadata?.animations.length)
            ) {
              throw new GraphQLError(
                `animations metadata not found in the manifest.json file.`
              );
            }

            const animationFile = zip
              .folder("animations")
              ?.file(`${dotLottieMetadata?.animations[0].id}.json`);

            if (!animationFile) {
              throw new GraphQLError(
                `animations file not found in the .lottie file`
              );
            }
            jsonLottieText = await animationFile?.async("text");
            jsonLottieAnimation = JSON.parse(jsonLottieText);
          } catch (err) {
            throw new GraphQLError(`Failed to unzip the .lottie file.`);
          }
        } else if (file && file.name.endsWith(".json")) {
          try {
            jsonLottieText = await file.text();
            jsonLottieAnimation = JSON.parse(jsonLottieText);
          } catch (err) {
            throw new GraphQLError(`Failed to read the .json file.`);
          }
        }
        if (
          dotLottieMetadata &&
          dotLottieMetadata.animations &&
          dotLottieMetadata.animations.length &&
          dotLottieMetadata?.animations[0].id
        ) {
          name = dotLottieMetadata?.animations[0].id;
        } else {
          if (jsonLottieAnimation && jsonLottieAnimation.nm) {
            name = jsonLottieAnimation.nm;
          }
        }

        if (!jsonLottieText) {
          throw new GraphQLError(`Failed to fetch .`);
        }

        const newAnimation = await context.prisma.animation.create({
          data: {
            name: name,
          },
        });

        await context.prisma.content.create({
          data: {
            filename: file.name,
            filetype: fileExtension === ".lottie" ? "dotLottie" : "json",
            content: jsonLottieText,
            metadata: dotLottieMetadataText || null,
            animationId: newAnimation.id,
          },
        });

        await context.prisma.metadata.create({
          data: {
            version: dotLottieMetadata?.version || "",
            author: dotLottieMetadata?.author || "",
            generator: dotLottieMetadata?.generator || "",
            keywords: dotLottieMetadata?.keywords || "",
            revision: dotLottieMetadata?.revision || null,
            animationId: newAnimation.id,
          },
        });
        return newAnimation;
      } catch (e: unknown) {
        throw new GraphQLError(
          (e instanceof GraphQLError && e.message) ||
            `Animation: ${name}' failed to be uploaded`
        );
      }
    },
  },
  Animation: {
    id: (parent: Animation) => parent.id,
    name: (parent: Animation) => parent.name,
    content: (parent: Animation, args: {}, context: GraphQLContext) => {
      return context.prisma.content.findUnique({
        where: {
          animationId: parent.id,
        },
      });
    },
    metadata: (parent: Animation, args: {}, context: GraphQLContext) => {
      return context.prisma.metadata.findUnique({
        where: {
          animationId: parent.id,
        },
      });
    },
    createdAt: (parent: Animation) => parent.createdAt.toISOString(),
  },
};

export const schema = createSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
