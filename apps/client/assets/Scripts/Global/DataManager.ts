import { Prefab, SpriteFrame, Node } from "cc";
import { JoytStickManager } from "../../UI/JoytStickManager";
import Singleton from "../Base/Singleton";
import { EntityTypeEnum, IActorMove, IBullet, IClienInput, IState, InputTypeEnum } from "../Common";
import { ActorManager } from "../Entity/Actor/ActorManager";
import { BulletManager } from "../Entity/Bullet/BulletManager";
import EventManager from "./EventManager";
import { EventEnum } from "../Enum";

// 速度
const ACTOR_SPEED = 100;
const BULLET_SPEED = 600;

// 地图大小
const MAP_WIDTH = 960;
const MAP_HEIGHT = 2077;

// 人物、子弹大小
const ACTOR_RADIUS = 50;
const BULLET_RADIUS = 10;

const BULLET_DAMAGE = 10;

/** 管理游戏实体物件（角色节点，子弹节点，通用预制，通用图片） */
export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  myPlayerId: number = 1;
  frameId: number = 1;

  jm: JoytStickManager;
  stage: Node;
  actorMap: Map<number, ActorManager> = new Map();
  bulletMap: Map<number, BulletManager> = new Map();
  prefabMap: Map<string, Prefab> = new Map();
  textureMap: Map<string, SpriteFrame[]> = new Map();

  state: IState = {
    actors: [{
      id: 1,
      hp: 30,
      position: {
        x: -150,
        y: -150
      },
      direction: {
        x: 1,
        y: 0
      },
      type: EntityTypeEnum.Actor1,
      weaponType: EntityTypeEnum.Weapon1,
      bulletType: EntityTypeEnum.Bullet2,
    }, {
      id: 2,
      hp: 100,
      position: {
        x: 150,
        y: 150
      },
      direction: {
        x: -1,
        y: 0
      },
      type: EntityTypeEnum.Actor1,
      weaponType: EntityTypeEnum.Weapon1,
      bulletType: EntityTypeEnum.Bullet2,
    }],
    bullets: [],
    nextBulletId: 1
  }

  applyInput(inputs: IClienInput) {
    switch (inputs.type) {
      case InputTypeEnum.ActorMove: {
        const {
          id,
          dt,
          direction: { x, y }
        } = inputs;

        const actor = this.state.actors.find(v => v.id === id);
        actor.direction.x = x;
        actor.direction.y = y;

        actor.position.x += x * dt * ACTOR_SPEED;
        actor.position.y += y * dt * ACTOR_SPEED;
        break;
      }
      case InputTypeEnum.WeaponShoot: {
        const { owner, position, direction } = inputs;
        const bullet: IBullet = {
          type: this.actorMap.get(owner).bulletType,
          id: this.state.nextBulletId++,
          owner,
          position,
          direction
        }

        EventManager.Instance.emit(EventEnum.BulletBorn, owner);

        this.state.bullets.push(bullet);
        break;
      }
      case InputTypeEnum.TimePast: {
        const { dt } = inputs;
        const { bullets, actors } = this.state;

        for (let i = bullets.length - 1; i >= 0; i--) {
          const bullet = bullets[i];

          // 人物碰撞检测
          for (let j = actors.length - 1; j >= 0; j--) {
            const actor = actors[j];
            if (
              (actor.position.x - bullet.position.x) ** 2 + (actor.position.y - bullet.position.y) ** 2 <
              (ACTOR_RADIUS + BULLET_RADIUS) ** 2
            ) {

              actor.hp -= BULLET_DAMAGE;
              EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, {
                x: (actor.position.x + bullet.position.x) / 2,
                y: (actor.position.y + bullet.position.y) / 2,
              })

              bullets.splice(i, 1);
              break;
            }
          }

          // 地图边缘
          if (Math.abs(bullet.position.x) > MAP_WIDTH / 2 || Math.abs(bullet.position.y) > MAP_HEIGHT / 2) {
            EventManager.Instance.emit(EventEnum.ExplosionBorn, bullet.id, { x: bullet.position.x, y: bullet.position.y });
            bullets.splice(i, 1);
            break;
          }

          bullet.position.x += bullet.direction.x * dt * BULLET_SPEED;
          bullet.position.y += bullet.direction.y * dt * BULLET_SPEED;
        }
        break;
      }
    }
  }
}
