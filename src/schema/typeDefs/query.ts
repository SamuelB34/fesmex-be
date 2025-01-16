export const queryTypeDefs = `
    type Query {
        foo: String!
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
        role: String
        created_at: String
        created_by: String
    }
`
