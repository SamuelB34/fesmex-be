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
        getAnnouncements(
            id: ID,
            page: Int,
            pageSize: Int,
            sortBy: String,
            sortOrder: String,
            searchField: String,
            searchValue: String
        ): AnnouncementListResponse
        getArticleById(id: ID!): Article
        getAllArticles(
            page: Int
            pageSize: Int
            sortBy: String
            sortOrder: String
            searchField: String
            searchValue: String
        ): ArticlePaginationResult!
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
    
    type UserTyper {
        id: ID!
        first_name: String!
        last_name: String!
    }

    type Announcement {
        id: ID!
        title: String!
        text: String!
        roles: [UserRole]
        created_at: String
        created_by: UserTyper
        updated_at: String
        updated_by: UserTyper
    }

    type AnnouncementListResponse {
        total: Int
        announcements: [Announcement]
        page: Int
        pageSize: Int
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
        price: Float!
        currency: String
    }

    type ArticlePaginationResult {
        total: Int!
        articles: [Article!]!
        page: Int!
        pageSize: Int!
    }
`
