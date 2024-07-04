import { WebSocketServer } from "ws";
import { symlinkCommon } from "./Utils";
import { ApiMsgEnum } from "./Common";
import { Connection, MyServer } from "./Core";
import { PlayerManager } from "./Biz/PlayerManager";

// symlinkCommon();

declare module "./Core" {
    interface Connection {
        playerId: number;
    }
}


const server = new MyServer({ port: 9877 });
server.start().then(() => { console.log('服务启动！') });

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection: Connection, data: any) => {
    const { nickname } = data;
    const player = PlayerManager.Instance.createPlayer(nickname, connection);
    connection.playerId = player.id;
    return {
        player: PlayerManager.Instance.getPlayerView(player)
    }
});

server.on('connection', (connection: Connection) => {
    console.log('来人了', server.connections.size);
});

server.on('connection', (connection: Connection) => {
    console.log('人走了', server.connections.size);
    if (connection.playerId) {
        PlayerManager.Instance.removePlayer(connection.playerId);
    }
});

// const wss = new WebSocketServer({
//     port: 9877
// });

// let inputs = [];

// wss.on('connection', (socket) => {
//     socket.on('message', (buffer) => {
//         try {
//             const str = buffer.toString();
//             const msg = JSON.parse(str);
//             const { name, data } = msg;
//             const { input, frameId } = data;
//             inputs.push(input);
//         } catch (error) {
//             console.log(error);
//         }
//     });


//     setInterval(()=>{
//         const temp = inputs;
//         inputs = [];
//         const msg = {
//             name: ApiMsgEnum.MsgServerSync,
//             data: {
//                 inputs: temp
//             }
//         }
//         socket.send(JSON.stringify(msg));
//     }, 10);

// })

// wss.on('listening', () => {
//     console.log('服务启动');
// })