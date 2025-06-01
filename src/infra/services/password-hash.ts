import { genSalt, hash } from "bcrypt-ts";

export async function generatePasswordHash(password: string) {
    const salt = await genSalt(10);
    return await hash(password, salt);
}