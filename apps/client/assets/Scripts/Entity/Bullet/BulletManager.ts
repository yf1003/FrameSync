import { _decorator, Component, director, instantiate, IVec2, Node } from 'cc';
import DataManager from '../../Global/DataManager';
import { EntityTypeEnum, IActor, IBullet, InputTypeEnum } from '../../Common';
import { EntityManager } from '../../Base/EntityManager';
import { EntityStateEnum, EventEnum } from '../../Enum';
import { WeaponManager } from '../Weapon/WeaponManager';
import { radToAngle } from '../../Utils';
import { BulletStateMachine } from './BulletStateMachine';
import EventManager from '../../Global/EventManager';
import { ExplosionManager } from '../Explosion/ExplosionManager';
import { ObjectPoolManager } from '../../Global/ObjectPoolManager';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends EntityManager {
    type: EntityTypeEnum;
    id: number;

    init(data: IBullet) {
        this.type = data.type;
        this.id = data.id;
        this.fsm = this.addComponent(BulletStateMachine);
        this.fsm.init(data.type);

        this.state = EntityStateEnum.Idle;
        this.node.active = false;
        EventManager.Instance.on(EventEnum.ExplosionBorn, this.handlerExplosionBorn, this);
    }

    onDestroy() {
        
    }

    handlerExplosionBorn(id: number, { x, y }: IVec2) {
        if (this.id !== id) return;

        const explosion = ObjectPoolManager.Instance.get(EntityTypeEnum.Explosion);
        const em = explosion.getComponent(ExplosionManager) || explosion.addComponent(ExplosionManager);
        em.init(EntityTypeEnum.Explosion, { x, y });

        DataManager.Instance.bulletMap.delete(this.id);
        ObjectPoolManager.Instance.ret(this.node);
        EventManager.Instance.off(EventEnum.ExplosionBorn, this.handlerExplosionBorn, this);
    }

    render(data: IBullet) {
        const { direction, position } = data;

        this.node.active = true;
        this.node.setPosition(position.x, position.y);

        const side = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const angle = direction.x > 0 ? radToAngle(Math.asin(direction.y / side)) : radToAngle(Math.asin(-direction.y / side)) + 180;

        this.node.setRotationFromEuler(0, 0, angle);
    }
}

