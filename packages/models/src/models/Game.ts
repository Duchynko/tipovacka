import { Document, Model, Schema, Types } from 'mongoose';
import { FixtureEventDetail, FixtureEventType, GameStatus } from './Enums';

export interface ITeam {
  teamId: number;
  name: string;
  logo: string;
}

export interface IGameEvent {
  type: FixtureEventType;
  detail: FixtureEventDetail;
  teamId: number;
  teamName: string;
  playerId: number;
  playerName: string;
  assistPlayerId: number | undefined;
  assistPlayerName: string | undefined;
  time: number;
}

export interface IGame {
  gameId: number;
  date: Date;
  homeTeam: ITeam;
  awayTeam: ITeam;
  homeTeamScore?: number;
  awayTeamScore?: number;
  events?: IGameEvent[];
  status: GameStatus;
  competitionId: number;
  competitionName: string;
  season: number;
  venue: string;
}

export interface IGameEventDocument extends IGameEvent, Types.Subdocument {
  _version: number;
}
export interface ITeamDocument extends ITeam, Types.Subdocument {
  _version: number;
}
export interface IGameDocument extends IGame, Document<Types.ObjectId> {
  _version: number;
  events?: Types.Array<IGameEventDocument>;
}
export type IGameModel = Model<IGameDocument>;

const TeamSchema = new Schema<ITeamDocument>({
  _version: { type: Number, default: 1, required: true },
  teamId: { type: Number, required: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
});

const GameEventSchema = new Schema<IGameEventDocument>({
  _version: { type: Number, default: 1, required: true },
  type: { type: String, enum: Object.values(FixtureEventType), required: true },
  detail: {
    type: String,
    enum: Object.values(FixtureEventDetail),
    required: true,
  },
  teamId: { type: Number, required: true },
  teamName: { type: String, required: true },
  playerId: { type: Number, required: true },
  playerName: { type: String, required: true },
  assistPlayerId: { type: Number, required: true },
  assistPlayerName: { type: String, required: true },
  time: { type: Number, required: true },
});

export const GameSchema = new Schema<IGameDocument, IGameModel>(
  {
    _version: { type: Number, default: 1, required: true },
    gameId: { type: Number, required: true },
    date: { type: Date, required: true },
    homeTeam: {
      type: TeamSchema,
      required: true,
    },
    awayTeam: {
      type: TeamSchema,
      required: true,
    },
    homeTeamScore: { type: Number, required: true, default: 0 },
    awayTeamScore: { type: Number, required: true, default: 0 },
    events: [{ type: GameEventSchema, required: true, default: [] }],
    status: { type: String, enum: Object.values(GameStatus), required: true },
    competitionId: { type: Number, required: true },
    competitionName: { type: String, required: true },
    season: { type: Number, required: true },
    venue: { type: String, required: true },
  },
  { timestamps: true }
);