import bcrypt from 'bcrypt'
import dotenv from "dotenv";

dotenv.config();

export const hashedPassword = (data: string | Buffer) => {
    bcrypt.hash(data, 15, function(err, hash) {
        if (err) throw (err)
        return hash
    });
}