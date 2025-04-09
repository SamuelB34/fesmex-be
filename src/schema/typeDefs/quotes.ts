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
        createQuote(input: QuoteInput! avoidPipedrive: Boolean!): Quote
        updateQuote(id: ID!, input: QuoteInput! avoidPipedrive: Boolean!): Quote
        deleteQuote(id: ID!, deletedBy: String!): String
        updateStatus(id: ID!, status: String!): Quote
        updateQuoteStatus(id: ID!, quote_status: String!): Quote
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
        company_pipedrive_id: String
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
        status: String
        pipedrive_id: String
        pdf_download_link: String
        quote_status: String
    }

    type CompanyContact {
        name: String!
        email: String!
        mobile: String!
        pipedrive_id: String
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
        company_pipedrive_id: String
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
        status: String
				quote_status: String
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
        pipedrive_id: String
    }

    input CompanyContactInput {
        name: String!
        email: String!
        mobile: String!
        pipedrive_id: String
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
        status: String
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
        status: String
        quote_status: String
        only_last: Boolean
    }
`
