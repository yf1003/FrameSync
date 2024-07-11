import Singleton from "../Base/Singleton";
import { IApiPlayerJoinReq } from "../Common";
import { Connection } from "../Core";
import { Player } from "./Player";

export class PlayerManager extends Singleton {
    static get Instance() {
        return super.GetInstance<PlayerManager>();
    }

    nextPlayerId: number = 1;
    players: Set<Player> = new Set();
    idMapPlayer: Map<number, Player> = new Map();

    createPlayer({ connection, nickname }: IApiPlayerJoinReq & { connection: Connection }): Player {
        const player = new Player({ id: this.nextPlayerId++, nickname, connection });
        this.players.add(player);
        this.idMapPlayer.set(player.id, player);

        return player;
    }

    removePlayer(pid: number) {
        const player = this.idMapPlayer.get(pid);
        if (player) {
            this.players.delete(player);
            this.idMapPlayer.delete(pid);
        }
    }

    getPlayerView({ id, nickname, roomId }: Player) {
        return {
            id, nickname, roomId
        }
    }
}
