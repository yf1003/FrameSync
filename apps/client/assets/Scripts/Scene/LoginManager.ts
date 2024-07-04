import { _decorator, Component, director, EditBox, Node } from 'cc';
import { NetworkManager } from '../Global/NetworkManager';
import { ApiMsgEnum } from '../Common';
import DataManager from '../Global/DataManager';
import { SceneEnum } from '../Enum';
const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
    input: EditBox;
    onLoad() {
        this.input = this.getComponentInChildren(EditBox);
    }

    async start() {
        await NetworkManager.Instance.connect();
    }

    async handleClick() {
        if (!NetworkManager.Instance.isConnected) {
            console.log('未连接');
            await NetworkManager.Instance.connect();
            return;
        }

        const nickname = this.input.string;
        if (!nickname) {
            console.log('需输入用户名');
            return;
        }

        const { success, res, error } = await NetworkManager.Instance.callApi(ApiMsgEnum.ApiPlayerJoin, { nickname: nickname })
        if (!success) {
            console.log(error);
            return;
        }
          
        DataManager.Instance.myPlayerId = res.player.id;

        director.loadScene(SceneEnum.Battle);
    }
}

