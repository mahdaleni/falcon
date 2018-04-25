import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";


const SALT_ROUNDS = 10;

const UserSchema = new Schema({
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        firstName: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        secret: {
            type: String,
            required: true,
        },
    },
);

UserSchema.pre("save", next => {
    const user = this;

    bcrypt.hash(user.secret, SALT_ROUNDS, (err, hash) => {
        if (err) {
            return next(err);
        }

        user.secret = hash;
        next();
    });

});

const User = model("User", UserSchema);
export default User;