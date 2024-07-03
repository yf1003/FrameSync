export enum FsmParamTypeEnum {
  Number = "Number",
  Trigger = "Trigger",
}

export enum ParamsNameEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}

export enum EventEnum {
  WenponShoot = 'WenponShoot',
  ExplosionBorn = 'ExplosionBorn',
  BulletBorn = 'BulletBorn',
}

export enum PrefabPathEnum {
  Map = 'prefabs/Map',
  Actor1 = 'prefabs/Actor1',
  Weapon1 = 'prefabs/Weapon1',
  Bullet1 = 'prefabs/Bullet1',
  Bullet2 = 'prefabs/Bullet2',
  Explosion = 'prefabs/Explosion',
}

export enum TexturebPathEnum {
  Actor1Idle = 'texture/actor/actor1/idle',
  Actor1Run = 'texture/actor/actor1/run',
  Weapon1Idle = 'texture/weapon/weapon1/idle',
  Weapon1Attack = 'texture/weapon/weapon1/attack',
  Bullet1Idle = 'texture/bullet/bullet1',
  Bullet2Idle = 'texture/bullet/bullet2',
  ExplosionIdle = 'texture/explosion',
}

export enum EntityStateEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}
