export const clientTypeDefs = `
    type Query {
        getClientById(id: ID!): Client
        getAllClients(
            page: Int
            pageSize: Int
            sortBy: String
            sortOrder: String
            filters: ClientFilterInput
            startDate: String
            endDate: String
        ): ClientPaginationResult!
    }

    type Mutation {
        createClient(input: ClientInput!): Client
        updateClient(id: ID!, input: ClientInput!): Client
        deleteClient(id: ID!, deletedBy: String!): String
    }

    type ClientPaginationResult {
        total: Int!
        clients: [Client!]!
        page: Int!
        pageSize: Int!
    }

    type Client {
        id: ID!
        sn_code: String
        sn_name: String
        tax_id: String
        currency: String
        phone_1: String
        email: String
        sales_department_employee_code: String
        sales_department_employee_name: String
        payment_terms_code: String
        payment_terms_name: String
        price_list_number: String
        price_list_name: String
        address_name: String
        street: String
        neighborhood: String
        postal_code: String
        city: String
        state: String
        country_region: String
        payment_method_code: String
        payment_method_description: String
        comments: String
        contacts: [Contact]
        created_at: String
        pipedrive_id: String
    }

    type Contact {
        contact_person_name: String
        first_name: String
        last_name: String
        contact_phone: String
        contact_email: String
        pipedrive_id: String
    }

    input ClientInput {
        sn_code: String
        sn_name: String
        tax_id: String
        currency: String
        phone_1: String
        email: String
        sales_department_employee_code: String
        sales_department_employee_name: String
        payment_terms_code: String
        payment_terms_name: String
        price_list_number: String
        price_list_name: String
        address_name: String
        street: String
        neighborhood: String
        postal_code: String
        city: String
        state: String
        country_region: String
        payment_method_code: String
        payment_method_description: String
        comments: String
        contacts: [ContactInput]
    }

    input ContactInput {
        contact_person_name: String
        first_name: String
        last_name: String
        contact_phone: String
        contact_email: String
    }

    input ClientFilterInput {
        sn_code: String
        sn_name: String
        tax_id: String
        currency: String
        phone_1: String
        email: String
        sales_department_employee_code: String
        sales_department_employee_name: String
        payment_terms_code: String
        payment_terms_name: String
        price_list_number: String
        price_list_name: String
        city: String
        state: String
        country_region: String
    }
`
