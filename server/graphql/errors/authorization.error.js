import { GraphQLError } from "graphql/error";


export class AuthorizationError extends GraphQLError {
    constructor(userType, action) {
        super(`AuthorizationError: User of type ${userType} is not authorized to perform ${action}`);
    }
}