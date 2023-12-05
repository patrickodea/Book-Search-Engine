const {User} = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth');

const resolvers = {
    Query: {
      //we use this to get the current logged in user from the jwt token, and send that user with the populated list of their saved books
        me: async (parent, args, context) =>  {
            const foundUser = await User.findOne({
                _id: context.user._id,
              })
            .populate('savedBooks');
          
              if (!foundUser) {
                throw AuthenticationError;
              }
          
              return foundUser;
        }
    },
    Mutation: {
      //create a new user in the db, and sign their info to jwt token. return both the token and user
        createUser: async (parent, {username, email, password}) => {
            const user = await User.create({
              username:username,
              email:email,
              password:password,
            });

            if (!user) {
              throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, {email, password}) => {
          //find a user by email in the db, and verify their password. if no errors, sign their token for auth purposes
          //return the token and user object
          const user = await User.findOne( { email: email });
          if (!user) {
            throw AuthenticationError;
          }
      
          const correctPw = await user.isCorrectPassword(password);
      
          if (!correctPw) {
            throw AuthenticationError;
          }
          const token = signToken(user);
          return ({ token, user });
        },
        //find the current auth'd user from the jwt token context, and save a book to a user's saveBook subdocument in the auth'd user's document
        saveBook: async (parent, {content}, context) => {
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: content } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            } catch (err) {
              console.log(err);
              throw AuthenticationError;
            }
        },
        //find the current auth'd user from the jwt token context, and delete a book by id from the user's savedBook subdocument
        deleteBook: async (parent, params, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
              );
              if (!updatedUser) {
                throw AuthenticationError;
              }
              return updatedUser;
        }
    }
}

module.exports = resolvers;