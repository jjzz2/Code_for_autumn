import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash-es';
import Taro from '@tarojs/taro';
import Request from 'src/network/intelligence-chat';
import Track from 'src/api/track'; // 引入埋点
import {
    updateMessageList,
    updateMessageListAndLoading,
    updateAILoading,
} from '../../store/actions'; // 引入 actions

// 1. 定义清晰的输入参数
export const useMessageSender = ({ params, context, userId, assistantId, recordPowerStatus, isShipperIn, onSendSuccess }) => {
    const dispatch = useDispatch();

    // 2. 从 Redux 获取所需状态
    const { rtcV3OnlineStatus, showAILoading, cargoStatusValid, messageList, smartChatToastInfo } =
        useSelector(state => state.pageData);

    const sendMessageTimestamp = useRef(0);

    // 3. sendMessage 接收要发送的文本作为参数
    const sendMessage = useCallback(async (question) => {
        // --- 前置检查 ---
        if (rtcV3OnlineStatus === 'on') {
            Taro.showToast({ title: '当前正在通话，请挂断后操作', context });
            return;
        }
        if (Date.now() - sendMessageTimestamp.current < 2000) return;
        if (!question?.trim()) {
            Taro.showToast({ title: '不能发送空白消息', context });
            return;
        }
        if (showAILoading) {
            Taro.showToast({ title: smartChatToastInfo?.noResponseReceived || '助理正在回答问题，请稍后再试', context });
            return;
        }
        if (!cargoStatusValid) {
            Taro.showToast({ title: '货源已下架，看看其他货吧', context });
            return;
        }

        sendMessageTimestamp.current = Date.now();
        Taro.hideKeyboard({ context });
        Track.tap('xxfs', { /* ...埋点信息... */ context });

        // --- 乐观 UI 更新 (核心：创建新数组) ---
        const tempMessage = {
            outSeqId: '',
            cargoId: params.cargoId,
            fromUid: userId,
            toUid: assistantId,
            base: {
                chatType: 'chat',
                content: { content: question },
                type: 'txt',
                msgStatus: 2,
            },
            ext: { diChatRobotResponse: false },
            isHideCardButton: false,
        };

        // 使用扩展运算符创建新数组，而不是 .push()
        const optimisticList = [...messageList, tempMessage];

        dispatch(
            updateMessageListAndLoading({
                messageList: optimisticList,
                showAILoading: !isShipperIn,
            })
        );

        // 通过回调通知组件执行 UI 操作
        onSendSuccess?.();

        // --- API 调用 ---
        try {
            const result = await Request.sendSmartChatMessage({
                chatRecordId: params.chatRecordId,
                cargoId: params.cargoId,
                base: { content: question, /* ... */ },
                shipperRemarkV2: 1,
                hasMicrophoneAuthorization: recordPowerStatus == 1,
            }, context);

            if (result.result === 1) {
                // --- 成功后更新 (核心：使用 map 创建新数组) ---
                const finalList = optimisticList.map(msg =>
                    msg === tempMessage ? { ...msg, outSeqId: result.data.outSeqId } : msg
                );
                dispatch(updateMessageList(finalList));
            } else {
                // --- 失败后更新 ---
                const finalList = optimisticList.map(msg =>
                    msg === tempMessage ? { ...msg, failSeqId: Date.now() + '' } : msg
                );
                dispatch(updateMessageList(finalList));
                dispatch(updateAILoading(false));
                Taro.showToast({ title: result?.errorMsg ?? '发送失败', context });
            }
        } catch (error) {
            // --- 异常处理 ---
            const finalList = optimisticList.map(msg =>
                msg === tempMessage ? { ...msg, failSeqId: Date.now() + '' } : msg
            );
            dispatch(updateMessageList(finalList));
            dispatch(updateAILoading(false));
            Taro.showToast({ title: '发送失败', context });
        }
    }, [
        // 依赖项列表
        rtcV3OnlineStatus,
        showAILoading,
        cargoStatusValid,
        messageList,
        params,
        context,
        userId,
        assistantId,
        recordPowerStatus,
        isShipperIn,
        dispatch,
        onSendSuccess,
    ]);

    // 4. 返回需要暴露的函数
    return {
        sendMessage,
        // sendSoundMessage 也可以用同样的方式封装
    };
};
