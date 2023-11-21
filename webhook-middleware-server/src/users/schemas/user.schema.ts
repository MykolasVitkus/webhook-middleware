import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
    @Prop()
    id: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Date, required: true, default: Date.now })
    createdAt: Date;

    async checkPassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

export const UserSchema = SchemaFactory.createForClass(User).pre(
    'save',
    function (next) {
        const user = this as UserDocument;
        user.username = user.username.toLowerCase();

        bcrypt.genSalt(10, (genSaltError, salt) => {
            if (genSaltError) {
                return next(genSaltError);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    },
);
