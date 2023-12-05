import { gql } from '@apollo/client';

//create a user mutation
//db will return the jwt token and the added user
export const ADD_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

//mutation to login. db will return jwt signed token and the logged in user
export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            username
        }
    }
  }
`;
//add a book to the logged in user's saved books
export const ADD_BOOK = gql`
  mutation saveBook($content: BookArrayInput!) {
    saveBook(content: $content){
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
//delete a logged in user's saved book
export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: String!) {
    deleteBook(bookId: $bookId) {
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