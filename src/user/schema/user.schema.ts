import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WordHistory {
  @Prop({ required: true })
  word: string;

  @Prop({ default: Date.now })
  added: Date;
}

@Schema()
export class FavoriteWord {
  @Prop({ required: true })
  word: string;

  @Prop({ default: Date.now })
  added: Date;
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [WordHistory], default: [] })
  history: WordHistory[];

  @Prop({ type: [FavoriteWord], default: [] })
  favorites: FavoriteWord[];
}

export const UserSchema = SchemaFactory.createForClass(User);
