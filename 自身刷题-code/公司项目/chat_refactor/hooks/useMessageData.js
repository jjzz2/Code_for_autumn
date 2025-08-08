import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash-es';
import Tiga from '@fta/tiga';

import {
    fetchMessageList, // 假设这是正确的 action name
    updateCargoDetail,
    updateCargoStatusValid,
    updateShipperMaxSeqId,
    updateHasNewMessage,
    updateMessageList, // 需要引入这个 action 来处理图片撤回
} from '../../store/actions';
import { cargoCometStatusEnum, OpType } from '../../type'; // 假设 OpType 在这里

// 1. 定义清晰的输入参数
export const useMessageData = ({ params, context, startTime, onNewMessage }) => {
    const dispatch = useDispatch();

    // 2. 从 Redux 获取唯一的数据源
    const { unread, messageList } = useSelector(state => state.pageData);

    // useRef + useCallback 模式是正确的，用于避免陈旧闭包
    const receiveMessageRef = useRef(null);

    // 3. 将 handleRetractImage 逻辑移入 Hook 内部
    const handleRetractImage = useCallback((imgId) => {
        const updatedList = messageList.map(message => {
            if (message.ext?.imgId === imgId) {
                return { ...message, imgShow: false };
            }
            return message;
        });
        // 避免直接修改 messageList，而是派发一个 action 来更新
        dispatch(updateMessageList(updatedList));
    }, [messageList, dispatch]);

    const getMessages = debounce((orientation, outSeqId) => {
        // 4. 当获取到新消息时，调用回调通知组件
        const callback = () => {
            if (onNewMessage) {
                onNewMessage();
            }
        };
        return dispatch(
            fetchMessageList( // 使用一致的 action name
                {
                    cargoId: params.cargoId,
                    chatRecordId: params.chatRecordId,
                    orientation,
                    outSeqId,
                },
                context,
                callback, // 将回调传递给 action
                Number(unread || 0),
                startTime
            )
        );
    }, 100, { leading: false, trailing: true });

    const receiveMessage = useCallback((msg) => {
        if (!msg?.msgContent) return;

        let tempMsg = msg.msgContent;
        if (typeof tempMsg === 'string') {
            try {
                tempMsg = JSON.parse(tempMsg);
            } catch (e) {
                // 解析失败则忽略
            }
        }

        if (tempMsg?.cargoId == params.cargoId) {
            switch (tempMsg?.cargoCometStatus) {
                case cargoCometStatusEnum.AI_MSG: // 使用 Enum
                    if (messageList.length) {
                        const lastOutSeqId = messageList[messageList.length - 1]?.outSeqId;
                        getMessages(1, lastOutSeqId);
                    } else {
                        getMessages(0, 0);
                    }
                    return;
                case cargoCometStatusEnum.PRICE_UPDATE:
                    dispatch(updateCargoDetail(context));
                    return;
                case cargoCometStatusEnum.CARGO_INVALID:
                    dispatch(updateCargoStatusValid(false));
                    return;
                case cargoCometStatusEnum.SHIPPER_SEQ_ID:
                    dispatch(updateShipperMaxSeqId(tempMsg.lastSeqId));
                    return;
                case cargoCometStatusEnum.IMG_BACK:
                    // 延迟处理，给用户一个视觉反应时间
                    setTimeout(() => handleRetractImage(tempMsg.imgId), 1000);
                    return;
            }
        } else {
            dispatch(updateHasNewMessage(true));
        }
    }, [messageList, params, context, getMessages, dispatch, handleRetractImage]);

    // 这个模式是正确的
    useEffect(() => {
        receiveMessageRef.current = receiveMessage;
    }, [receiveMessage]);

    const receiveMessageCallback = useCallback((msg) => {
        receiveMessageRef.current?.(msg);
    }, []);

    useEffect(() => {
        Tiga.Message.registerLongConnListen({
            context: context,
            opType: OpType.DI_AI_SEND_DRIVER_MSG_EVENT,
            // 5. 修正参数名
            receiveMessageCallback: receiveMessageCallback,
        });

        return () => {
            Tiga.Message.removeLongConnListen({
                context: context,
                opType: OpType.DI_AI_SEND_DRIVER_MSG_EVENT,
                receiveMessageCallback: receiveMessageCallback,
            });
        };
    }, [context, receiveMessageCallback]); // 依赖 context 和 callback

    // 6. 返回需要暴露给组件的函数
    return {
        getMoreMessages: getMessages,
    };
};
