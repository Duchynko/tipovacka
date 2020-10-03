import mongoose, { Schema } from 'mongoose'
import { IGame } from './Game'
import { IUser } from './User'

export interface IBet {
  homeTeamScore: number
  awayTeamScore: number
  game: IGame | mongoose.Types.ObjectId
  user: IUser | mongoose.Types.ObjectId
}

// export type IBetDocument = IBet & Document

export const BetSchema = new Schema({
  _version: { type: Number, required: true, default: 1 },
  homeTeamScore: { type: Number, required: true, default: 1 },
  awayTeamScore: { type: Number, required: true, default: 1 },
  game: { type: Schema.Types.ObjectId, ref: 'game' },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
})
