import {gql} from '@apollo/client';
//query to get the current logged in user's info and all of their saved books
export const QUERY_ME = gql`
    query me {
        me {
            _id
            username
            savedBooks {
                authors
                description
                bookId
                image
                link
                title
            }
        }
    }
`;