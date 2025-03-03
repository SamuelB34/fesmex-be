export const queryTypeDefs = `
    type Query {
        foo: String!
        getAnnouncements(
            id: ID,
            page: Int,
            pageSize: Int,
            sortBy: String,
            sortOrder: String,
            searchField: String,
            searchValue: String
        ): AnnouncementListResponse!
        getArticleById(id: ID!): Article
        getAllArticles(
            page: Int
            pageSize: Int
            sortBy: String
            sortOrder: String
            filters: ArticleFilters
            startDate: String
            endDate: String
        ): ArticlePaginationResult!
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
        total: Int!
        announcements: [Announcement]!
        page: Int!
        pageSize: Int!
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
        created_at: String!
        updated_at: String!   # 🔹 Se agregó updated_at aquí
        created_by: UserTyper
    }

    type ArticlePaginationResult {
        total: Int!
        articles: [Article!]!
        page: Int!
        pageSize: Int!
    }

    input ArticleFilters {
        article_number: String
        description: String
        brand: String
        group: String
        sub_class: String
        model: String
        currency: String
        created_by: ID
        sat_code: String
    }
`
