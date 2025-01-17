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
    createAnnouncement(input: CreateAnnouncementInput!): Announcement
    updateAnnouncement(id: ID!, input: UpdateAnnouncementInput!): Announcement
    deleteAnnouncement(id: ID!): String
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

  type Token {
    id: ID!
    jwt: String!
  }
  
	type UserTyper {
		id: ID!
		first_name: String!
		last_name: String!
	}

  type Announcement {
    id: ID!
    title: String!
    text: String!
    roles: [UserRole!]!
    created_at: String!
    created_by: UserTyper!
  }
`
