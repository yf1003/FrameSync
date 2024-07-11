import { IClienInput } from "./State";

export interface IMsgClientSync {
    input: IClienInput;
    frameId: number;
}

export interface IMsgServerSync {
    inputs: IClienInput[];
    lastFrameId: number;
}