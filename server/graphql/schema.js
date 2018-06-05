import { makeExecutableSchema } from "graphql-tools";
import requireText from "require-text";
import { Mutation, Query } from "./resolvers";


function fileToText(path) {
    // Insert new line to avoid merging last line of previous file to first line of next file
    return requireText(path, require) + "\n";
}

const schemaDefinition = fileToText("./schema.graphql");
const queries = fileToText("./queries.graphql");

const types = [
    "class",
    "date",
    "faculty",
    "profile_changes",
    "user",
];

const mutations = [
    "class",
    "faculty",
    "request_profile_changes",
    "review_profile_changes",
    "user",
];

const typeDefinitions = types
    .map(type => `${type}.type.graphql`) // Transform type to fileName
    .map(fileName => `./types/${fileName}`) // Transform fileName to path
    .map(path => fileToText(path)) // Get file contents as string
    .join("\n"); // Merge array to one string

const mutationDefinitions = mutations
    .map(type => `${type}.mutation.graphql`)
    .map(fileName => `./mutation_extensions/${fileName}`)
    .map(path => fileToText(path))
    .join("\n");

export const schema = makeExecutableSchema({
    typeDefs: [schemaDefinition, queries, typeDefinitions, mutationDefinitions],
    resolvers: {Query, Mutation},
    resolverValidationOptions: {
        // Removes resolveType warning from console
        requireResolversForResolveType: false,
    },
});
