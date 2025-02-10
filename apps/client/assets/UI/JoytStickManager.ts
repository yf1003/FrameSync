import * as cc from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoytStickManager')
export class JoytStickManager extends Component {
    public input: cc.Vec3;
    private body: cc.Node;        
    private stick: cc.Node;  

    private defaultPosition: cc.Vec3;
    private radius: number = 0;  

    onLoad() {
        this.input = new cc.Vec3();
        this.body = this.node.getChildByName('Body');
        this.stick = this.body.getChildByName('Stick');
        this.defaultPosition = this.body.position.clone();
        this.radius = this.body.getComponent(cc.UITransform).width / 2;
        cc.input.on(cc.Input.EventType.TOUCH_START, this.onTouchStart, this);
        cc.input.on(cc.Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.input.on(cc.Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        cc.input.off(cc.Input.EventType.TOUCH_START, this.onTouchStart, this);
        cc.input.off(cc.Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.input.off(cc.Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: cc.EventTouch) {
        const touchPos = event.getUILocation();
        this.body.setWorldPosition(touchPos.x, touchPos.y, 0);
    }

    private onTouchMove(event: cc.EventTouch) {
        const touchPos = event.getUILocation();  
        const stickPos = new cc.Vec3(touchPos.x - this.body.worldPosition.x, touchPos.y - this.body.worldPosition.y);
        if (stickPos.length() > this.radius) {
            stickPos.multiplyScalar(this.radius / stickPos.length());
        }

        this.stick.setPosition(stickPos);
        this.input = stickPos.normalize();
    }
    private onTouchEnd() {
        this.body.setPosition(this.defaultPosition);
        this.stick.setPosition(0, 0, 0);
        this.input.set(0, 0, 0);
    }
}

