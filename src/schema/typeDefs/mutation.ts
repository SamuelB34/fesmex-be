export const mutationTypeDefs = `
		enum UserRole {
				admin
				sales
				technician
				warehouseman
		}

    type Mutation {
        scheduleOperation(name: String!, user: Int!): String!
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
		}
		
		input UpdateUserInput {
				username: String
				first_name: String
				middle_name: String
				last_name: String
				role: UserRole
				authenticated: Boolean
		}


    input LoginInput {
        username: String!
        password: String!
    }

    type Token {
        id: ID!
        jwt: String!
    }
`
