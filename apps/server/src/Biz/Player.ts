import { Connection } from "../Core";

export class Player {
    id: number;
    nickname: string;
    connection: Connection;
    roomId: number = 1;

    constructor({ id, nickname, connection }: Pick<Player, 'id' | 'nickname' | 'connection'>) {
        this.id = id;
        this.nickname = nickname;
        this.connection = connection;
    }
}