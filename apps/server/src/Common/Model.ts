import { IApiPlayerJoinReq, IApiPlayerJoinRes } from "./Api"
import { ApiMsgEnum } from "./Enum"

export interface IModel {
    api: {
        [ApiMsgEnum.ApiPlayerJoin]: {
            req: IApiPlayerJoinReq,
            res: IApiPlayerJoinRes
        }
    }
}
