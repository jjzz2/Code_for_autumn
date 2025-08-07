import eventCenter from '@fta/apis-event-center'
import { autoFix, Line, Popover, PullToRefresh, scale, Text } from '@fta/components'
import Tiga from '@fta/tiga'
import { Image, ScrollView, View } from '@tarojs/components'
import Taro, { pxTransform, useDidHide } from '@tarojs/taro'
import { appInfo as myApp } from '@thresh/thresh-component'
import { Keyboard, SealComponent } from '@thresh/thresh-lib'
import { debounce, throttle } from 'lodash-es'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useThreshContext from 'src/api/useThreshContext'
import images from 'src/assets/index'
import { EventName, OpType } from 'src/utils/const'
import { Logger } from 'src/utils/log'

import { PositionEnum, SwitchStatueEnum } from '../../enum'
import {
    fetchMessageList,
    replaySendMessage,
    reportReadMaxSeqId,
    updateCargoDetail,
    updateCargoStatusValid,
    updateFrequentlyQuestionListVisible,
    updateHasNewMessage,
    updateMessageList,
    updateShipperMaxSeqId,
} from '../../store/actions'
import { RootState } from '../../store/reducers'
import { cargoCometStatusEnum, MessageType } from '../../type'
import AddressCard from '../address-card'
import AiNoticeAuthCard from '../ai-notice-auth-card'
import CarLengthTypeConfirmCard from '../car-length-type-confirm-card'
import ChatAvatar from '../chat-avatar'
import HelloCard from '../hello-card'
import ImageCard from '../image-card'
import MiddleTip from '../middle-tip'
import NotesCard from '../notes-card'
import NotesCardNew from '../notes-card-new'
import PathCard from '../path-card'
import PayDepositCard from '../pay-deposit-card'
import TelephoneCard from '../telephone-card-new'
import VoiceCard from '../voice-card'
import WarningCard from '../warning-tip'
import styles from './index.module.scss'

const { Lottie } = SealComponent
//对于公司项目的整合处理：
//1.发送信息处理：原来时常无法得到最新的信息，原来只有fetchMessage长轮询机制对其进行不断询问，然后蜕变为使用信息长脸并对其使用消息长链缓存处理
//2.首屏时间的优化：使用可视区域来进行优化
//3.货主介入ai聊天时的体现：在原先时可能会发生错误导致无法得到正确的信息，然后进行逻辑判断
//4.rtc通话逻辑处理
//明天完成整体复习，不摆了

export default (props: any) => {
    const context = useThreshContext()
    const intervalRef = useRef<any>(null)
    const dispatch = useDispatch()
    const scrollRef = useRef<any>(null)
    const {
        stopLoading,
        params,
        messageList,
        assistantId,
        assistantUrl,
        assistantAvatar,
        driverAvatar,
        shipperAvatar,
        showAILoading,
        unread,
        hideTooltipRef,
        voiceSpeakerToken,
        voiceSpeaker,
        smartChatConfigInfo,
        isVoiceCall,
        soundList,
        avatarSwitch,
        shipperNickName,
        shipperLastSeqId = '',
        isVoiceCallRtc,
        rtcCallStatus,
        rtcV3OnlineStatus,
        hitRtcVoicePictureSyncGray,
    } = useSelector((store: RootState) => store.pageData)
    //首先设置通话令牌
    const token = useRef(voiceSpeakerToken)
    //设置dom直接获取useRef
    const popoverRefs = useRef({} as any).current
    const longPressMessageOutSeqId = useRef('')
    const [broadcastStartIndex, setBroadcastStartIndex] = useState('-1')
    const [firstBroadcastIndex, setFirstBroadcastIndex] = useState('')
    let $aiLoading: SealComponent.ILottie | null

    const hideTooltip = () => {
        popoverRefs[longPressMessageOutSeqId.current]?.hide?.()
    }
    const reSendMsgTs = useRef(0)
    const receiveMessageRef = useRef((msg: any) => {})
    useEffect(() => {
        hideTooltipRef.current = hideTooltip
        return () => {
            stopSpeaker()
        }
    }, [])

    useDidHide(() => {
        hideTooltip()
    })
    useLayoutEffect(() => {
        // 初始化时，将从页面级组件里获取的消息列表下拉至底部
        // if (orientation === 0 && outSeqId === 0) {
        scrollRef?.current?.scrollToEnd?.({ animated: false }) // 滑动至底部
        // }
    }, [])

    useEffect(() => {
        token.current = voiceSpeakerToken
    }, [voiceSpeakerToken])

    useEffect(() => {
        // 上报最新已读seqId
        if (stopLoading && messageList?.length > 0) {
            dispatch(reportReadMaxSeqId(messageList, context))
        }
    }, [messageList.length, stopLoading])
    /*
    停止播报
    */
    const stopSpeaker = () => {
        if (token.current) {
            voiceSpeaker?.stop({ token: token.current })
        }
    }
    /**
     * 获取历史消息
     * @param orientation 拉取消息历史消息类型 0 向上 1 向下   初始时传0
     * @param outSeqId 发件箱消息顺序ID 初始时传0
     */
    const  getMessages = debounce(
        (orientation, outSeqId) => {
            return dispatch(
                fetchMessageList(
                    {
                        cargoId: params.cargoId,
                        chatRecordId: params.chatRecordId,
                        orientation,
                        outSeqId,
                    },
                    context,
                    scrollToEnd,
                    Number(unread || 0),
                    props?.startTime
                )
            )
        },
        100,
        {
            leading: false,
            trailing: true,
        }
    )

    /**
     * 处理长链消息
     * @param msg
     */
    const receiveMessage = useCallback(
        (msg: {
            /** 长链业务类型名 */
            opType: string
            /** 业务字段 */
            msgContent?: any
        }) => {
            console.log('🚀---接受到长链', msg, params.cargoId, messageList)
            Logger.warn('接受到长链' + JSON.stringify(msg), context)
            if (!msg?.msgContent) return
            let tempMsg = msg.msgContent
            if (typeof tempMsg === 'string') {
                try {
                    tempMsg = JSON.parse(tempMsg)
                } catch (e) {}
            }
            if (tempMsg?.cargoId == params.cargoId) {
                switch (tempMsg?.cargoCometStatus) {
                    case 0: // AI消息
                        if (messageList.length) {
                            // @ts-ignore
                            const lastOutSeqId = messageList[messageList.length - 1]
                            // 有消息记录时向下拉取更多消息
                            getMessages(1, lastOutSeqId.outSeqId)
                        } else {
                            // 初始时
                            getMessages(0, 0)
                        }
                        return
                    case 1: // 货主加价更新价格
                        dispatch(updateCargoDetail(context))
                        return
                    case 2: // 货源下架、删除、成交，不给编辑
                        dispatch(updateCargoStatusValid(false))
                        return
                    case 6:
                        dispatch(updateShipperMaxSeqId(tempMsg.lastSeqId))
                        return
                    case cargoCometStatusEnum.IMG_BACK:
                        setTimeout(() => {
                            handleRetractImage(tempMsg.imgId)
                        }, 2000)
                        return
                }
            } else {
                dispatch(updateHasNewMessage(true))
            }
        },
        [messageList]
    )

    // 处理撤回消息
    const handleRetractImage = useCallback(
        (imgId: string) => {
            const messageImg = messageList.find(message => message.ext.imgId === imgId)
            if (!!messageImg) {
                messageImg.imgShow = false
                dispatch(updateMessageList(messageList))
            }
        },
        [messageList]
    )

    /**
     * 消息ScrollView滑动至底部
     */
    const scrollToEnd = throttle(
        () => {
            scrollRef?.current?.scrollToEnd?.({ animated: false }) // 滑动至底部
        },
        100,
        {
            trailing: true,
            leading: false,
        }
    )

    useEffect(() => {
        // 如果能聊天
        if (!props.canchat || (props.canchat !== 'undefined' && props.canchat == '1')) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }

            intervalRef.current = setInterval(() => {
                // 如果开启音画同步，且语音通话状态为连接，则关闭轮询
                if (hitRtcVoicePictureSyncGray && isVoiceCallRtc && rtcCallStatus === 2) {
                    return
                }

                if (messageList.length) {
                    // 有消息记录时向下拉取更多消息
                    getMessages(1, messageList[messageList.length - 1].outSeqId)
                } else {
                    // 初始时
                    getMessages(0, 0)
                }
            }, 10000)
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [messageList, getMessages, props.canchat, rtcCallStatus, hitRtcVoicePictureSyncGray])

    useEffect(() => {
        if (messageList.length === 0) return
        const lastOne = messageList[messageList.length - 1]

        if (broadcastStartIndex == '-1') {
            setBroadcastStartIndex(lastOne.outSeqId)
        }

        //第一条语音消息
        const driverMessageBeforFirstBroadcasetIndex = messageList.findIndex(message => {
            return message.ext.voiceUrl
        })

        const firstBroadCast = messageList.find(
            (message, index) =>
                message.fromUid == assistantId &&
                index > driverMessageBeforFirstBroadcasetIndex &&
                driverMessageBeforFirstBroadcasetIndex != -1
        )
        //自动播报设置最后一个播放的seqId
        if (
            (smartChatConfigInfo?.voiceBroadcasting === SwitchStatueEnum.ON || isVoiceCall) &&
            !firstBroadcastIndex &&
            firstBroadCast
        ) {
            setFirstBroadcastIndex(firstBroadCast.outSeqId)
        }
    }, [messageList.length, assistantId, smartChatConfigInfo?.voiceBroadcasting])

    useEffect(() => {
        // getMessages(0, 0)
        eventCenter.addEventListener(EventName.intelligence_chat_message_scroll_to_end, scrollToEnd, {
            context,
        })
        return () => {
            eventCenter.removeEventListener(
                EventName.intelligence_chat_message_scroll_to_end,
                scrollToEnd,
                {
                    context,
                }
            )
            if (voiceSpeakerToken) {
                voiceSpeaker?.stop({ token: voiceSpeakerToken })
            }
        }
    }, [])
    useEffect(() => {
        receiveMessageRef.current = receiveMessage
    }, [receiveMessage])

    const receiveMessageCallback = useCallback(msg => {
        receiveMessageRef.current?.(msg)
    }, [])
    useEffect(() => {
        // 注册长链，去拉取历史消息记录
        Tiga.Message.registerLongConnListen({
            context: context,
            opType: OpType.DI_AI_SEND_DRIVER_MSG_EVENT,
            receiveMessageCallback: receiveMessageCallback,
            complete(res) {
                console.log('注册opType di_ai_send_driver_msg_event监听 complete结果: ', res)
            },
        })
        Logger.warn('注册opType di_ai_send_driver_msg_event监听', context)
        return () => {
            Logger.warn('解除注册opType di_ai_send_driver_msg_event监听', context)
            // 取消注册长链
            Tiga.Message.removeLongConnListen({
                context: context,
                opType: OpType.DI_AI_SEND_DRIVER_MSG_EVENT,
                receiveMessageCallback: receiveMessageCallback,
                success(res) {
                    console.log('解除注册opType di_ai_send_driver_msg_event success结果: ', res)
                },
                fail(res) {
                    console.log('解除注册opType di_ai_send_driver_msg_event fail结果: ', res)
                },
            })
        }
    }, [])

    /**
     * 下拉获取更多消息
     */
    const getMoreMessageList = async () => {
        if (messageList.length) {
            getMessages(0, messageList[0].outSeqId)
        }
    }
    /**
     * 重发消息
     */
    const reSendMessage = failSeqId => {
        if (Date.now() - reSendMsgTs.current < 1000) {
            return
        }
        reSendMsgTs.current = Date.now()
        // dispatch(updateAILoading(false))
        // dispatch(updateSendMsgResult(true))
        dispatch(replaySendMessage(context, failSeqId))
    }
    /**
     * 复制文案
     * @param text 要复制的文案
     */
    const copyText = (text: string) => {
        Keyboard.copy(context, text)
        hideTooltip()
        Taro.showToast({ title: '复制成功', context })
    }
    const showTooltip = outSeqId => {
        hideTooltip()
        const ref = popoverRefs[outSeqId]
        ref?.show()
        longPressMessageOutSeqId.current = outSeqId
    }
    const CardComponent = {
        1: HelloCard,
        3: PayDepositCard,
        4: PayDepositCard,
        5: AddressCard,
        6: TelephoneCard,
        // 7: NotesCard,
        8: PathCard,
        9: NotesCard,
        10: CarLengthTypeConfirmCard,
        11: AiNoticeAuthCard,
        13: NotesCardNew,
        15: PayDepositCard, //成交卡片
    }

    const tipRender = (message: MessageType) => {
        return (
            <>
                {message.base?.bidStateMsg ? (
                    <MiddleTip card={1} prefixText={message.base.bidStateMsg} />
                ) : null}
                {message.ext?.messageTip ? (
                    <MiddleTip card={0} prefixText={message.ext.messageTip} />
                ) : null}
            </>
        )
    }

    const renderReadTip = (position: PositionEnum, message: MessageType) => {
        const flag = shipperLastSeqId < message.outSeqId || !shipperLastSeqId || !message.outSeqId
        return (
            <>
                {position === PositionEnum.RIGHT && false ? (
                    <Text className={flag ? styles.readUnAlreadyRight : styles.readAlreadyRight}>
                        {flag ? '未读' : '已读'}
                    </Text>
                ) : (
                    <Text className={styles.readTipHolder} />
                )}
            </>
        )
    }

    const isNotMessageShow = useCallback((message: MessageType) => {
        return !message.imgShow && message.base.type === 'img'
    }, [])

    return (
        <PullToRefresh
            optimize
            loadingProps={{ tintColor: '#ff7000' }}
            onRefresh={getMoreMessageList}
            renderText={() => ({
                pulling: '再往下拉一点试试',
                refreshing: '正在加载中',
                done: '加载完成',
            })}
            contentStyle={{
                flex: 1,
                overflow: 'scroll',
            }}
        >
            <ScrollView
                className={styles['chat-record']}
                // @ts-ignore
                scrollToOffsetWhenBuild={false}
                rangeMaintaining
                ref={scrollRef}
                onDragStart={() => {
                    hideTooltip()
                }}
                onClick={() => {
                    dispatch(updateFrequentlyQuestionListVisible(false))
                }}
            >
                <View style={{ height: scale(20) }} />
                {messageList?.map?.((message, index) => {
                    // 消息隐藏
                    if (isNotMessageShow(message)) {
                        return null
                    }
                    let position = PositionEnum.LEFT
                    if (
                        (myApp.app.isDriver && message.fromUid !== assistantId) ||
                        (myApp.app.isShipper && message.fromUid === assistantId)
                    ) {
                        position = PositionEnum.RIGHT
                    }
                    // @ts-ignore 获取最后一个司机信息
                    const lastDriverMessage = messageList.findLast(
                        (item, indexLastFind) =>
                            indexLastFind <= index && item.fromUid !== assistantId && item.base.type !== 'cmd'
                    )
                    // 最后一个司机消息 不是通话 且 是语音消息
                    const lastDriverMessageIsVoiceAndNotCall =
                        !!lastDriverMessage?.ext?.voiceUrl && !lastDriverMessage?.ext?.voiceCallId

                    const showVoiceCardForText =
                        smartChatConfigInfo?.smartVoiceDriverGray &&
                        ((message.base.type === 'txt' &&
                                message.fromUid === assistantId &&
                                lastDriverMessageIsVoiceAndNotCall &&
                                myApp.app.isDriver &&
                                message.ext.shipperMessageFlag !== 1) ||
                            message?.ext?.voiceUrl ||
                            message.base?.content?.type === 'voiceRemark') &&
                        !message.ext.voiceCallId
                    const content = showVoiceCardForText
                        ? {
                            data: {
                                msg: message.base.content.content,
                            },
                            voiceDuration: message.ext.voiceDuration,
                            outSeqId: message.outSeqId,
                        }
                        : message.base.type === 'card'
                            ? JSON.parse(message.base.content.content || '')
                            : message.base.content.content || {}
                    if (
                        (message.base.type === 'card' || showVoiceCardForText || message.base.type === 'img') &&
                        content?.cardType != 12
                    ) {
                        try {
                            content.voiceDuration = message.ext?.voiceDuration || 0
                            content.alphabetText = message.ext?.alphabetText
                            // 是否自动播报
                            const autoBroadCast =
                                // 回复司机语音的助理消息
                                (message.outSeqId > broadcastStartIndex &&
                                    broadcastStartIndex != '-1' &&
                                    message.fromUid === assistantId &&
                                    (message.ext.shipperMessageFlag === undefined ||
                                        message.ext.shipperMessageFlag !== 1) &&
                                    smartChatConfigInfo?.voiceBroadcasting === SwitchStatueEnum.ON &&
                                    !!lastDriverMessage?.ext?.voiceUrl) || // 原来的逻辑：司机说了一句话，后面所有AI说的都转语音
                                // 语音备注
                                (message?.ext?.voiceUrl &&
                                    message?.base?.content?.type === 'voiceRemark' &&
                                    !message?.isVoiceRemarkDisabled &&
                                    myApp.app.isDriver) ||
                                // 货主介入聊天
                                (message.outSeqId > broadcastStartIndex &&
                                    broadcastStartIndex != '-1' &&
                                    message.fromUid === assistantId &&
                                    message.ext.shipperMessageFlag == 1 &&
                                    smartChatConfigInfo?.voiceBroadcasting === SwitchStatueEnum.ON &&
                                    message.ext?.voiceUrl) // 货主只要说了，只要是语音就可以播放

                            if (
                                (content?.cardType && CardComponent[content?.cardType]) ||
                                showVoiceCardForText ||
                                message.base.type === 'img'
                            ) {
                                const CardComp = showVoiceCardForText ? VoiceCard : CardComponent[content?.cardType]
                                return (
                                    <>
                                        {message.ext?.shipperInDriverTips ? (
                                            <MiddleTip card={0} prefixText={message.ext.shipperInDriverTips} />
                                        ) : null}
                                        <View
                                            key={message.outSeqId + '_' + index}
                                            className={styles['chat-record-item']}
                                            style={{
                                                flexDirection: position === PositionEnum.RIGHT ? 'row-reverse' : 'row',
                                            }}
                                            onClick={() => {
                                                dispatch(updateFrequentlyQuestionListVisible(false))
                                                hideTooltip()
                                            }}
                                        >
                                            <ChatAvatar
                                                avatar={
                                                    message.fromUid == assistantId
                                                        ? message.ext?.shipperMessageFlag == 1 ||
                                                        message?.base?.content?.type === 'voiceRemark'
                                                            ? shipperAvatar || images.default_shipper_avatar
                                                            : avatarSwitch == 1
                                                                ? shipperAvatar || images.default_shipper_avatar
                                                                : assistantAvatar || images.robot_avatar
                                                        : driverAvatar || images.default_avatar
                                                }
                                                shipperNickname={shipperNickName}
                                                isDriver={message.fromUid !== assistantId}
                                                isShipper={
                                                    message.ext.shipperMessageFlag == 1 ||
                                                    message?.base?.content?.type === 'voiceRemark'
                                                }
                                                tag={images.assistant_avatar_bottom}
                                                position={position}
                                            />
                                            <Popover.MeasureView
                                                ref={ref => {
                                                    popoverRefs[message.outSeqId] = ref
                                                }}
                                                render={rect => (
                                                    <Popover.View
                                                        style={{
                                                            top: rect.top - 40,
                                                            left: rect.left + (rect.width - autoFix(96)) / 2,
                                                            position: 'absolute',
                                                        }}
                                                        visible
                                                        arrowPlacement='bottom'
                                                        text='复制'
                                                        textStyle={{ fontSize: scale(24) }}
                                                        arrowStyle={{ left: scale(40) }}
                                                        onClick={() => copyText(content?.data?.msg ?? '')}
                                                    />
                                                )}
                                            >
                                                {/* MeasureView的直接子元素需要是View节点！！！ */}
                                                <View
                                                    onLongPress={() => {
                                                        if (content?.cardType !== 1) return
                                                        showTooltip(message.outSeqId)
                                                    }}
                                                    onClick={() => {
                                                        hideTooltip()
                                                    }}
                                                >
                                                    {message.base.type === 'img' ? (
                                                        <ImageCard
                                                            key={message.outSeqId}
                                                            position={position}
                                                            url={message.base?.content?.url}
                                                        />
                                                    ) : (
                                                        <CardComp
                                                            auto={
                                                                autoBroadCast &&
                                                                smartChatConfigInfo?.voiceAutoplay === SwitchStatueEnum.ON &&
                                                                !isVoiceCallRtc &&
                                                                rtcV3OnlineStatus !== 'on' &&
                                                                !props.popShow
                                                            }
                                                            position={position}
                                                            data={content}
                                                            ExitPageConfirm={props.ExitPageConfirm}
                                                            onCallOffRtc={props.onCallOffRtc}
                                                            showPrompt={props.showPrompt}
                                                            canchat={props.canchat}
                                                            message={message}
                                                            speaker={voiceSpeaker}
                                                            fail={!message.outSeqId && message.failSeqId}
                                                            showText={
                                                                smartChatConfigInfo?.voiceToText === SwitchStatueEnum.ON ||
                                                                message.fromUid === assistantId ||
                                                                myApp.app.isShipper
                                                            }
                                                            isHideCardButton={message.isHideCardButton}
                                                            reSendMessage={() => reSendMessage(message.failSeqId)}
                                                            voiceSrc={
                                                                message.ext?.zjTtsFlag &&
                                                                message?.ttsUrlInvalid &&
                                                                message.ext?.ttsUrl
                                                                    ? message.ext?.ttsUrl
                                                                    : message.ext?.voiceUrl || message.base?.content?.voiceUrl
                                                            }
                                                            autoBroadCastCall={() => {
                                                                setBroadcastStartIndex(message.outSeqId)
                                                            }}
                                                            outSeqId={message.outSeqId}
                                                            isVoiceCall={isVoiceCall}
                                                            autoBroadCast={autoBroadCast}
                                                            soundList={soundList}
                                                        />
                                                    )}
                                                    {renderReadTip(position, message)}
                                                </View>
                                            </Popover.MeasureView>
                                        </View>
                                        {tipRender(message)}
                                    </>
                                )
                            } else {
                                return null
                            }
                        } catch (e) {
                            return null
                        }
                    } else if (message.base.type === 'cmd') {
                        if (
                            !message?.base?.content?.content ||
                            typeof message?.base?.content?.content !== 'string'
                        ) {
                            return <></>
                        }
                        let messageObjOrStr: any
                        try {
                            messageObjOrStr = JSON.parse(message?.base?.content?.content)
                        } catch (e) {
                            messageObjOrStr = {
                                prefixText: message?.base?.content?.content,
                            }
                        }

                        return (
                            <>
                                <MiddleTip {...messageObjOrStr} />
                            </>
                        )
                    } else if (message.base.type === 'txt' && !showVoiceCardForText) {
                        return (
                            <>
                                {message.ext?.shipperInDriverTips ? (
                                    <MiddleTip card={0} prefixText={message.ext.shipperInDriverTips} />
                                ) : null}
                                <View>
                                    <View
                                        key={message.outSeqId + '_' + index || 'sendmsg'}
                                        className={styles['chat-record-driver-item']}
                                        style={{
                                            flexDirection: position === PositionEnum.LEFT ? 'row-reverse' : 'row',
                                            // marginBottom: pxTransform(40),
                                        }}
                                        onClick={() => {
                                            dispatch(updateFrequentlyQuestionListVisible(false))
                                            hideTooltip()
                                        }}
                                    >
                                        <View
                                            className={styles['chat-record-driver-item-wrap']}
                                            style={{
                                                marginLeft: !message.outSeqId && message.failSeqId ? scale(82) : 0,
                                                justifyContent: position === PositionEnum.RIGHT ? 'flex-end' : 'flex-start',
                                            }}
                                        >
                                            {!message.outSeqId && message.failSeqId ? (
                                                <Image
                                                    src={images.error_status}
                                                    className={styles['chat-record-driver-item-wrap-error']}
                                                    onClick={() => reSendMessage(message.failSeqId)}
                                                />
                                            ) : null}
                                            <Popover.MeasureView
                                                ref={ref => {
                                                    popoverRefs[message.outSeqId] = ref
                                                }}
                                                render={rect => (
                                                    <Popover.View
                                                        style={{
                                                            top: rect.top - 40,
                                                            left: rect.left + (rect.width - autoFix(96)) / 2,
                                                            position: 'absolute',
                                                        }}
                                                        visible
                                                        arrowPlacement='bottom'
                                                        text='复制'
                                                        textStyle={{ fontSize: scale(24) }}
                                                        arrowStyle={{ left: scale(40) }}
                                                        onClick={() => copyText(message.base.content.content)}
                                                    />
                                                )}
                                            >
                                                {/* MeasureView的直接子元素需要是View节点！！！ */}
                                                <View
                                                    onLongPress={() => {
                                                        showTooltip(message.outSeqId)
                                                    }}
                                                    onClick={() => {
                                                        hideTooltip()
                                                    }}
                                                >
                                                    <View
                                                        className={styles['chat-record-driver-item-wrap-text']}
                                                        // wordBreak='breakAll'
                                                        style={{
                                                            backgroundColor:
                                                                position === PositionEnum.RIGHT ? '#FFDDC9' : '#ffffff',
                                                            color: position === PositionEnum.RIGHT ? '#662D00' : '#1a1a1a',
                                                            borderTopLeftRadius:
                                                                position === PositionEnum.LEFT ? pxTransform(4) : pxTransform(16),
                                                            borderTopRightRadius:
                                                                position === PositionEnum.RIGHT ? pxTransform(4) : pxTransform(16),
                                                        }}
                                                    >
                                                        {message?.ext?.parentSeqId && message?.ext?.parentContent ? (
                                                            <View>
                                                                <View className={styles['quick-reply']}>
                                                                    <View className={styles['quick-reply-title']}>AI小助理</View>
                                                                    <View className={styles['quick-reply-content']}>
                                                                        <Text
                                                                            numberoflines={2}
                                                                            wordBreak='breakAll'
                                                                            className={styles['quick-reply-content']}
                                                                        >
                                                                            {message?.ext?.parentContent}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <Line
                                                                    color='#E8E8E8'
                                                                    bold
                                                                    margin={{
                                                                        top: scale(20),
                                                                        bottom: scale(20),
                                                                    }}
                                                                />
                                                            </View>
                                                        ) : null}
                                                        {message.base.content.content}
                                                    </View>
                                                    {renderReadTip(position, message)}
                                                </View>
                                            </Popover.MeasureView>
                                        </View>

                                        <ChatAvatar
                                            avatar={
                                                message.fromUid == assistantId
                                                    ? message.ext?.shipperMessageFlag == 1
                                                        ? shipperAvatar || images.default_shipper_avatar
                                                        : avatarSwitch == 1
                                                            ? shipperAvatar || images.default_shipper_avatar
                                                            : assistantAvatar || images.robot_avatar
                                                    : driverAvatar || images.default_avatar
                                            }
                                            isDriver={message.fromUid !== assistantId}
                                            shipperNickname={shipperNickName}
                                            isShipper={message.ext.shipperMessageFlag == 1}
                                            tag={images.assistant_avatar_bottom}
                                            position={position}
                                        />
                                    </View>
                                </View>
                                {tipRender(message)}
                            </>
                        )
                    } else if (content?.cardType == 12) {
                        return <WarningCard key={message.outSeqId} {...content?.data} />
                    } else {
                        return null
                    }
                })}
                {/* 智能助理loading */}
                {showAILoading ? (
                    <View className={styles['chat-record-item']}>
                        <ChatAvatar
                            isDriver={false}
                            isShipper={false}
                            tag={images.assistant_avatar_bottom}
                            position={PositionEnum.LEFT}
                            avatar={
                                avatarSwitch
                                    ? shipperAvatar || images.default_shipper_avatar
                                    : assistantUrl || images.robot_avatar
                            }
                        />

                        <View className={styles['chat-record-item-ai-loading']}>
                            <Lottie
                                ref={_ref => {
                                    $aiLoading = _ref
                                }}
                                animate
                                repeat
                                style={{
                                    width: scale(110),
                                    height: scale(30),
                                }}
                                src='https://imagecdn.ymm56.com/ymmfile/static/resource/678a4b34-3fa8-49be-a7cf-63b0dbe92c4f.json'
                            />
                        </View>
                    </View>
                ) : null}
            </ScrollView>
        </PullToRefresh>
    )
}