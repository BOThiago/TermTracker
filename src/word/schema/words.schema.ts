import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class License {
  @Prop()
  name: string;

  @Prop()
  url: string;
}

export const LicenseSchema = SchemaFactory.createForClass(License);

@Schema()
export class Phonetic {
  @Prop()
  text: string;

  @Prop()
  audio: string;

  @Prop()
  sourceUrl: string;

  @Prop({ type: LicenseSchema })
  license: License;
}

export const PhoneticSchema = SchemaFactory.createForClass(Phonetic);

@Schema()
export class Definition {
  @Prop()
  definition: string;

  @Prop({ type: [String] })
  synonyms: string[];

  @Prop({ type: [String] })
  antonyms: string[];

  @Prop()
  example: string;
}

export const DefinitionSchema = SchemaFactory.createForClass(Definition);

@Schema()
export class Meaning {
  @Prop()
  partOfSpeech: string;

  @Prop({ type: [DefinitionSchema] })
  definitions: Definition[];

  @Prop({ type: [String] })
  synonyms: string[];

  @Prop({ type: [String] })
  antonyms: string[];
}

export const MeaningSchema = SchemaFactory.createForClass(Meaning);

@Schema()
export class Word extends Document {
  @Prop({ required: true })
  word: string;

  @Prop({ type: [PhoneticSchema], default: [] })
  phonetics: Phonetic[];

  @Prop({ type: [MeaningSchema], default: [] })
  meanings: Meaning[];

  @Prop({ type: LicenseSchema })
  license: License;

  @Prop({ type: [String], default: [] })
  sourceUrls: string[];
}

export const WordSchema = SchemaFactory.createForClass(Word);
