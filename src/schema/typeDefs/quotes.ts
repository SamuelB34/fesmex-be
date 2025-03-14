export const quotesTypeDefs = `
    type Query {
        getQuoteById(id: ID!): Quote
        getAllQuotes(
            page: Int
            pageSize: Int
            sortBy: String
            sortOrder: String
            filters: FiltersInput
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
        quote_ref: String!
        company: String!
        company_contact: CompanyContact!
        project_name: String!
        project_lab: String!
        payment_condition: String!
        payment_exp: String!
        article: [Article!]!
        created_by: CreatedBy!
        terms: [String!]!
        iva: String
        currency: String
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
        original_price: Float!
        total: Float!
        utility: Float!
        extra: ArticleExtra!
        type: String
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
        quote_ref: String!
        company: String!
        company_contact: CompanyContactInput!
        project_name: String!
        project_lab: String!
        payment_condition: String!
        payment_exp: String!
        article: [ArticleInput!]!
        created_by: CreatedByInput!
        terms: [String!]!
        iva: String
        currency: String
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
        original_price: Float!
        total: Float!
        utility: Float!
        extra: ArticleExtraInput!
        type: String
    }

    input ArticleExtraInput {
        multiplier: Float
        usa_freight: Float
        usa_expenses: Float
        duty: Float
        mex_freight: Float
    }

    input FiltersInput {
        quote_ref: String
        created_by: String
        project_name: String
        company: String
        payment_condition: String
        iva: String
        currency: String
    }
`
