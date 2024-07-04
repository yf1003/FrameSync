import { WebSocketServer, WebSocket } from "ws";
import { Connection } from "./Connection";
import { ApiMsgEnum } from "../Common";
import { EventEmitter } from "stream";

export class MyServer extends EventEmitter {
    port: number;
    wss: WebSocketServer;
    connections: Set<Connection> = new Set();
    apiMap: Map<ApiMsgEnum, Function> = new Map();

    constructor({ port }: { port: number }) {
        super();
        this.port = port;
    }

    async start() {
        return new Promise((resolve, reject) => {
            this.wss = new WebSocketServer({ port: 9877 });
            this.wss.on('listening', () => {
                resolve(true);
            });
            this.wss.on('close', () => {
                reject(false);
            });
            this.wss.on('error', (error) => {
                reject(error);
            });
            this.wss.on('connection', (ws: WebSocket) => {
                const cn = new Connection(this, ws);
                this.connections.add(cn);

                this.emit('connection', cn);

                cn.on('close', () => {
                    this.connections.delete(cn);
                    this.emit('disconnection', cn);
                })
            });
        });
    }

    setApi(name: ApiMsgEnum, cb: Function) {
        this.apiMap.set(name, cb);
    }
}