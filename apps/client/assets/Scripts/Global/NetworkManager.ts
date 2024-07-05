import { _decorator, resources, Asset, Node, instantiate, error } from "cc";
import Singleton from "../Base/Singleton";
import { IModel } from "../Common";

interface IItem {
    cb: Function;
    ctx: unknown;
}

interface ICallApiReturn<T> {
    success: boolean,
    res?: T;
    error?: Error;
}

export class NetworkManager extends Singleton {
    static get Instance() {
        return super.GetInstance<NetworkManager>();
    }

    private map: Map<string, Array<IItem>> = new Map();
    private port: number = 9876;
    private ws: WebSocket;
    isConnected: boolean = false;

    connect() {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                resolve(true);
                return;
            }

            this.ws = new WebSocket(`ws://localhost:${this.port}`);
            this.ws.onopen = () => {
                this.isConnected = true;
                resolve(true);
            };
            this.ws.onclose = () => {
                this.isConnected = false;
                reject(false);
            };
            this.ws.onerror = (e) => {
                this.isConnected = false;
                reject(false);
            };
            this.ws.onmessage = (e) => {
                try {
                    const json = JSON.parse(e.data);
                    const { name, data } = json;
                    if (this.map.has(name)) {
                        this.map.get(name).forEach(({ cb, ctx }) => {
                            cb.call(ctx, data);
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
            };
        });
    }

    async callApi<T extends keyof IModel['api']>(name: T, data: IModel['api'][T]['req']): Promise<ICallApiReturn<IModel['api'][T]['res']>> {
        return new Promise((resolve) => {
            try {
                const timer = setTimeout(() => {
                    this.unlistenMsg(name, cb);
                    resolve({ success: false, error: new Error('Time out!') });
                }, 3000);
                const cb = (res) => {
                    clearTimeout(timer);
                    this.unlistenMsg(name, cb);
                    resolve(res);
                }
                this.listenMsg(name, cb);
                this.sendMsg(name, data);
            } catch (error) {
                resolve({ success: false, error: new Error('Time out!') });
            }
        });
    }

    sendMsg(name: string, data) {
        const msg = {
            name, data
        }
        this.ws.send(JSON.stringify(msg));
    }

    listenMsg(name: string, cb: Function, ctx?: unknown) {
        if (this.map.has(name)) {
            this.map.get(name).push({ cb, ctx });
        } else {
            this.map.set(name, [{ cb, ctx }]);
        }
    }

    unlistenMsg(name: string, cb: Function, ctx?: unknown) {
        if (this.map.has(name)) {
            const index = this.map.get(name).findIndex((i) => cb === i.cb && i.ctx === ctx);
            index > -1 && this.map.get(name).splice(index, 1);
        }
    }
}
