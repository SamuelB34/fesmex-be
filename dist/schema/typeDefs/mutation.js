"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationTypeDefs = void 0;
exports.mutationTypeDefs = `
    type Mutation {
        scheduleOperation(name: String!, user: Int!): String!
        createAnnouncement(input: CreateAnnouncementInput!): Announcement
        updateAnnouncement(id: ID!, input: UpdateAnnouncementInput!): Announcement
        deleteAnnouncement(id: ID!): String
        createArticle(input: CreateArticleInput!): Article
        updateArticle(id: ID!, input: UpdateArticleInput!): Article
        deleteArticle(id: ID!): String
    }

    input CreateAnnouncementInput {
        title: String!
        text: String!
        roles: [UserRole!]!
    }

    input UpdateAnnouncementInput {
        title: String
        text: String
        roles: [UserRole]
    }

    input CreateArticleInput {
        article_number: String!
        description: String!
        count: Float!
        sat_code: String
        unit: String
        brand: String!
        group: String!
        sub_class: String
        model: String
        price: Float!
        currency: String
    }

    input UpdateArticleInput {
        article_number: String
        description: String
        count: Float
        sat_code: String
        unit: String
        brand: String
        group: String
        sub_class: String
        model: String
        price: Float
        currency: String
    }

    type Announcement {
        id: ID!
        title: String!
        text: String!
        roles: [UserRole!]!
        created_at: String!
        created_by: UserTyper!
    }

    type Article {
        id: ID!
        article_number: String!
        description: String!
        count: Float!
        sat_code: String
        unit: String
        brand: String!
        group: String!
        sub_class: String
        model: String
        price: Float
        currency: String
    }
`;
//# sourceMappingURL=mutation.js.map