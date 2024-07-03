import { _decorator, Component, director, instantiate, IVec2, Node } from 'cc';
import { EntityTypeEnum, IActor, IBullet, InputTypeEnum } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { ExplosionStateMachine } from './ExplosionStateMachine';
const { ccclass, property } = _decorator;

@ccclass('ExplosionManager')
export class ExplosionManager extends EntityManager {
    type: EntityTypeEnum;

    init(type: EntityTypeEnum, { x, y }: IVec2) {
        this.node.setPosition(x, y);
        this.type = type;
        this.fsm = this.addComponent(ExplosionStateMachine);
        this.fsm.init(type);

        this.state = EntityStateEnum.Idle;
    }
}

