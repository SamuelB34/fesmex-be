export const quotesTypeDefs = `
    type Query {
        getQuoteById(id: ID!): Quote
        getAllQuotes(
            page: Int
            pageSize: Int
            sortBy: String
            sortOrder: String
            searchField: String
            searchValue: String
            startDate: String
            endDate: String
        ): QuotePaginationResult!
    }

    type Mutation {
        createQuote(input: QuoteInput!): Quote
        updateQuote(id: ID!, input: QuoteInput!): Quote
        deleteQuote(id: ID!): String
    }

    type QuotePaginationResult {
        total: Int!
        quotes: [Quote!]!
        page: Int!
        pageSize: Int!
    }

    type Quote {
        id: ID!
        date: String!
        quote_number: Int!
        quote_revision: Int!
        company: String!
        company_contact: CompanyContact!
        project_name: String!
        project_lab: String!
        payment_condition: String!
        payment_exp: String!
        article: [Article!]!
				created_by: CreatedBy!
    }

    type CompanyContact {
        name: String!
        email: String!
        mobile: String!
    }

    type Article {
        article_number: String!
        delivery: String!
        description: String!
        quantity: Int!
        price: Float!
        total: Float!
        utility: Float!
        extra: ArticleExtra!
    }

    type ArticleExtra {
        multiplier: Float
        usa_freight: Float
        usa_expenses: Float
        duty: Float
        mex_freight: Float
    }

    input QuoteInput {
        date: String!
        quote_number: Int!
        quote_revision: Int!
        company: String!
        company_contact: CompanyContactInput!
        project_name: String!
        project_lab: String!
        payment_condition: String!
        payment_exp: String!
        article: [ArticleInput!]!
        created_by: CreatedByInput!
    }
    
    type CreatedBy {
    	id: String!
    	first_name: String!
    	last_name: String!
    }
    
    input CreatedByInput {
    	id: String!
    	first_name: String!
    	last_name: String!
    }

    input CompanyContactInput {
        name: String!
        email: String!
        mobile: String!
    }

    input ArticleInput {
        article_number: String!
        delivery: String!
        description: String!
        quantity: Int!
        price: Float!
        total: Float!
        utility: Float!
        extra: ArticleExtraInput!
    }

    input ArticleExtraInput {
        multiplier: Float
        usa_freight: Float
        usa_expenses: Float
        duty: Float
        mex_freight: Float
    }
`
