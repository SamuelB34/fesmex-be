"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersTypeDefs = void 0;
exports.usersTypeDefs = `
    type Query {
        getUserById(id: ID!): User
        getAllUsers(
            page: Int
            pageSize: Int
            sortBy: String
            sortOrder: String
            searchField: String
            searchValue: String
        ): UserPaginationResult!
    }
    
    type UserPaginationResult {
        total: Int!
        users: [User!]!
        page: Int!
        pageSize: Int!
    }
    
    type User {
        id: ID!
        username: String!
        first_name: String!
        middle_name: String
        last_name: String!
        authenticated: Boolean!
        email: String
        mobile: String
        role: String
        created_at: String
        created_by: String
    }

    type Token {
        id: ID!
        jwt: String!
    }

    type UserTyper {
        id: ID!
        first_name: String!
        last_name: String!
    }

    enum UserRole {
        admin
        sales
        technician
        warehouseman
    }

    type Mutation {
        createUser(input: CreateUserInput!): User
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): String
        login(input: LoginInput!): Token
    }

    input CreateUserInput {
        username: String!
        password: String!
        first_name: String!
        middle_name: String
        last_name: String!
        role: UserRole!
        email: String
        mobile: String
    }
    
    input UpdateUserInput {
        username: String
        first_name: String
        middle_name: String
        last_name: String
        role: UserRole
        authenticated: Boolean
				email: String
        mobile: String
    }

    input LoginInput {
        username: String!
        password: String!
    }
`;
//# sourceMappingURL=users.js.map