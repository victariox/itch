
import {Fetcher, Outcome, OutcomeState} from "./types";

import db from "../db";
import Game from "../db/models/game";

import client from "../api";
import normalize from "../api/normalize";
import {game} from "../api/schemas";
import {isNetworkError} from "../net/errors";

import {pathToId, gameToTabData} from "../util/navigation";

export default class GameFetcher extends Fetcher {
  constructor () {
    super();
  }

  async work(): Promise<Outcome> {
    const tabData = this.store.getState().session.tabData[this.tabId];
    if (!tabData) {
      return null;
    }

    const {path} = tabData;

    const gameId = +pathToId(path);

    const gameRepo = db.getRepo(Game);
    let localGame = await gameRepo.findOneById(gameId);
    let pushGame = (game: Game) => {
      if (!game) {
        return;
      }
      this.push(gameToTabData(game));
    };
    pushGame(localGame);

    const {credentials} = this.store.getState().session;
    if (!credentials) {
      throw new Error(`No user credentials yet`);
    }

    const {key} = credentials;
    const api = client.withKey(key);
    let normalized;
    try {
      this.debug(`Firing API requests...`);
      normalized = normalize(await api.game(gameId), {
        game: game,
      });
    } catch (e) {
      this.debug(`API error:`, e);
      if (isNetworkError(e)) {
        return new Outcome(OutcomeState.Retry);
      } else {
        throw e;
      }
    }

    this.debug(`normalized: `, normalized);
    pushGame(normalized.entities.games[normalized.result.gameId]);

    return new Outcome(OutcomeState.Success);
  }
}
