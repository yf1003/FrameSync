import * as cc from 'cc';
import { _decorator, Component, Node } from 'cc';
import EventManager from '../Scripts/Global/EventManager';
import { EventEnum } from '../Scripts/Enum';
const { ccclass, property } = _decorator;

@ccclass('ShootManager')
export class ShootManager extends Component {

    private handlerShoot() {
        EventManager.Instance.emit(EventEnum.WenponShoot)
    }
}

