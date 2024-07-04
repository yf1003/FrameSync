import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame } from 'cc';
import DataManager from '../Global/DataManager';
import { JoytStickManager } from '../../UI/JoytStickManager';
import { ResourceManager } from '../Global/ResourceManager';
import { ActorManager } from '../Entity/Actor/ActorManager';
import { EventEnum, PrefabPathEnum, TexturebPathEnum } from '../Enum';
import { ApiMsgEnum, EntityTypeEnum, IClienInput, InputTypeEnum } from '../Common';
import { BulletManager } from '../Entity/Bullet/BulletManager';
import { ObjectPoolManager } from '../Global/ObjectPoolManager';
import { NetworkManager } from '../Global/NetworkManager';
import EventManager from '../Global/EventManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    private stage: Node;
    private ui: Node;

    private shoudUpdate: boolean = false;
    onLoad() { }

    async start() {
        this.clearGame();
        await this.loadRes();
        this.initGame();
    }

    initGame() {
        DataManager.Instance.jm = this.ui.getComponentInChildren(JoytStickManager);
        this.shoudUpdate = true;
        EventManager.Instance.on(EventEnum.ClientSync, this.handleClientSync, this);
        NetworkManager.Instance.listenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this);
    }

    clearGame() {
        this.stage = DataManager.Instance.stage = this.node.getChildByName('Stage');
        this.ui = this.node.getChildByName('UI');
        EventManager.Instance.off(EventEnum.ClientSync, this.handleClientSync, this);
        NetworkManager.Instance.unlistenMsg(ApiMsgEnum.MsgServerSync, this.handleServerSync, this);

    }

    async loadRes() {
        const list = [];
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((prefab) => {
                DataManager.Instance.prefabMap.set(type, prefab);
            });
            list.push(p);
        }

        for (const type in TexturebPathEnum) {
            const p = ResourceManager.Instance.loadDir(TexturebPathEnum[type], SpriteFrame).then((spriteFrame) => {
                DataManager.Instance.textureMap.set(type, spriteFrame);
            });
            list.push(p);
        }

        await Promise.all(list);
    }

    update(dt: number) {
        if (!this.shoudUpdate) return;

        this.render();
        this.tick(dt);
    }

    tick(dt: number) {
        this.tickActor(dt);

        DataManager.Instance.applyInput({
            type: InputTypeEnum.TimePast,
            dt
        });
    }

    tickActor(dt: number) {
        for (const data of DataManager.Instance.state.actors) {
            let am = DataManager.Instance.actorMap.get(data.id);
            am.tick(dt);
        }
    }

    render() {
        this.renderActors();
        this.renderBullets();
    }

    renderActors() {
        for (const data of DataManager.Instance.state.actors) {
            let am = DataManager.Instance.actorMap.get(data.id);
            if (!am) {
                const prefab = DataManager.Instance.prefabMap.get(data.type);
                const actor = instantiate(prefab);
                actor.parent = this.stage;
                am = actor.addComponent(ActorManager);
                DataManager.Instance.actorMap.set(data.id, am);
                am.init(data);
            } else {
                am.render(data);
            }
        }
    }

    renderBullets() {
        for (const data of DataManager.Instance.state.bullets) {
            let bm = DataManager.Instance.bulletMap.get(data.id);
            if (!bm) {
                const bullet = ObjectPoolManager.Instance.get(data.type);
                bm = bullet.getComponent(BulletManager) || bullet.addComponent(BulletManager);
                DataManager.Instance.bulletMap.set(data.id, bm);
                bm.init(data);
            } else {
                bm.render(data);
            }
        }
    }

    handleClientSync(input: IClienInput) {
        const msg = {
            input,
            frameId: DataManager.Instance.frameId++
        }
        NetworkManager.Instance.sendMsg(ApiMsgEnum.MsgClientSync, msg);
    }

    handleServerSync({ inputs }: any) {
        for (let input of inputs) {
            DataManager.Instance.applyInput(input);
        }
    }
}

