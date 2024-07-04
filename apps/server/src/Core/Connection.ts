import { WebSocketServer, WebSocket } from "ws";
import { MyServer } from "./MyServer";
import { EventEmitter } from "stream";

interface IItem {
    cb: Function;
    ctx: unknown;
}

export class Connection extends EventEmitter {

    private msgMap: Map<string, Array<IItem>> = new Map();

    constructor(private server: MyServer, private ws: WebSocket) {
        super();
        this.ws.on('close', () => {
            this.emit('close');
        })

        this.ws.on('message', (buffer) => {
            try {
                const str = buffer.toString();
                const msg = JSON.parse(str);
                const { name, data } = msg;
                const { input, frameId } = data;

                if (this.server.apiMap.has(name)) {
                    const cb = this.server.apiMap.get(name);
                    const res = cb.call(null, this, data);
                    console.log(res);
                    this.sendMsg(name, {
                        success: true,
                        res: res
                    })
                } else if (this.msgMap.has(name)) {
                    this.msgMap.get(name).forEach(({ cb, ctx }) => {
                        cb.call(ctx, data);
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    sendMsg(name: string, data) {
        const msg = {
            name, data
        }
        this.ws.send(JSON.stringify(msg));
    }

    listenMsg(name: string, cb: Function, ctx?: unknown) {
        if (this.msgMap.has(name)) {
            this.msgMap.get(name).push({ cb, ctx });
        } else {
            this.msgMap.set(name, [{ cb, ctx }]);
        }
    }

    unlistenMsg(name: string, cb: Function, ctx?: unknown) {
        if (this.msgMap.has(name)) {
            const index = this.msgMap.get(name).findIndex((i) => cb === i.cb && i.ctx === ctx);
            index > -1 && this.msgMap.get(name).splice(index, 1);
        }
    }
}