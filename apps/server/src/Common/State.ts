import { EntityTypeEnum, InputTypeEnum } from "./Enum";

export interface IVec2 {
    x: number;
    y: number;
}

export interface IActor {
    id: number;
    hp: number;
    position: IVec2;
    direction: IVec2;
    type: EntityTypeEnum;
    weaponType: EntityTypeEnum;
    bulletType: EntityTypeEnum;
}

export interface IBullet {
    id: number;
    owner: number;
    position: IVec2;
    direction: IVec2;
    type: EntityTypeEnum
}

export interface IState {
    actors: IActor[];
    bullets: IBullet[];
    nextBulletId: number;
}

export type IClienInput = IActorMove | IWeaponShoot | ITimePast;

export interface IActorMove {
    type: InputTypeEnum.ActorMove,
    id: number,
    direction: IVec2,
    dt: number
}

export interface IWeaponShoot {
    type: InputTypeEnum.WeaponShoot,
    owner: number,
    position: IVec2,
    direction: IVec2,
}

export interface ITimePast {
    type: InputTypeEnum.TimePast;
    dt: number;
}