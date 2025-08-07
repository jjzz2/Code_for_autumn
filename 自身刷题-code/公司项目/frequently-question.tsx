import eventCenter from '@fta/apis-event-center'
import { Button, inIOS, Popover, Toast } from '@fta/components'
import { useLatest } from '@fta/hooks'
import Tiga from '@fta/tiga'
import UniBridge from '@fta/uni-bridge'
import { Image, Input, ScrollView, Text, View } from '@tarojs/components'
import Taro, { pxTransform } from '@tarojs/taro'
import { debounce } from 'lodash'
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Track from 'src/api/track'
import useThreshContext from 'src/api/useThreshContext'
import ImageIndex from 'src/assets/index'
import Request from 'src/network/intelligence-chat'
import DiStorage from 'src/utils/DiStorageUtil'
import { ExtendUtils } from 'src/utils/ExtendUtils'
import { EventName } from 'src/utils/const'
import { Logger } from 'src/utils/log'
import CargoKeyboard from '../../../../utils/CargoKeyboard'
import {
    checkProctocal,
    getRtcParams,
    updateAILoading,
    updateAudioContext,
    updateChatConfig,
    updateConstructParams,
    updateFrequentlyQuestionListVisible,
    updateGuideDataLogic,
    updateMessageList,
    updateMessageListAndLoading,
    updateMessageScrolllViewPaddingBottom,
    updatePhoneClickResponsed,
    updateTtsOutSeqId,
    updateTtsWaitList,
    updateVoiceSpeaker,
} from '../../store/actions'
import { RootState } from '../../store/reducers'
import { GuideCompNameEnum, searchConfigDto } from '../../type'
import VoiceInputPop from '../voice-input-pop'
import styles from './index.module.scss'

export default props => {
    const popRef = useRef<any>()
    const popRefVoice = useRef<any>()
    const context = useThreshContext()
    const dispatch = useDispatch()
    const [questionText, setQuestionText] = useState('') // 问题文本
    const [inputKey, setInputKey] = useState(1)
    const [showText, setShowText] = useState('按住说话') // 松开发送、取消发送
    const [recordPowerStatus, setRecordPowerStatus] = useState<any>()
    const {
        constructParam,
        params,
        initData,
        messageList,
        userId,
        showAILoading,
        cargoStatusValid,
        frequentlyQuestionListVisible,
        hideTooltipRef,
        assistantId = '',
        voiceSpeakerToken,
        smartChatConfigInfo,
        voiceSpeaker,
        smartChatToastInfo,
        audioContext,
        isVoiceCall,
        hangUpNum,
        guideStep,
        guideStepData,
        rtcVoiceCallGrey,
        rtcCode,
        driverId,
        searchConfig,
        loadingNewGrey,
        phoneClickResponsed,
        pluginVersionCode,
        rtcV3OnlineStatus,
        isVoiceCallRtc,
    } = useSelector((store: RootState) => store.pageData)
    const { issueTips } = initData
    const [selectedTag, setSelectedTag] = useState('')
    const sendMessageTimestamp = useRef(0)
    const textInputRef = useRef<any>()
    const [showIssues, setShowIssues] = useState<any[]>([])
    const [messageType, setMessageType] = useState('text')
    const [pressStatus, setPressStatus] = useState(false)
    const voiceIntRef: any = useRef(false)
    const showAILoadingRef = useLatest(showAILoading)
    const audioContextRef = useLatest(audioContext)
    const voiceSpeakerRef = useLatest(voiceSpeaker)
    const voiceSpeakerTokenRef = useLatest(voiceSpeakerToken)
    const messageListRef = useLatest(messageList)
    const beginTime = useRef(Date.now())
    const releaseTime = useRef(Date.now())
    const isVoiceCallRef = useLatest(isVoiceCall)
    const [isShipperIn, setIsShipperIn] = useState(false)
    const [isKeyBoaredPop, setIsKeyBoaredPop] = useState(false)
    const [showButtonTip, setShowButtonTip] = useState(false)

    // ----------------------------------------------------------------------
    // 语音输入弹窗相关
    const [popShow, setPopShow] = useState(false)
    const [pressMove, setPressMove] = useState(false)
    const [tooShort, setTooShort] = useState(false)
    /**
     * 计时器
     */
    const timerCount = 60 // 默认60秒
    const [count, setCount] = useState(timerCount)
    const countRef = useLatest(count)
    const timerRef = useRef<any>() // 记录时间的定时器
    const cutCount = () => {
        setCount(prevState => prevState - 1) // 为什么这里要用函数- 如果用count 发现count闭包了 不会发生变化了
    }

    useEffect(() => {
        console.log(count, '倒计时')
        if (count === 0 && popShow) {
            endVoice()
            clearInterval(timerRef.current) // 清空定时器
            setCount(timerCount) // 重新将计数器设置为60秒
        }
    }, [count])
    const countDown = () => {
        console.log('录音开始')
        cutCount()
        timerRef.current = setInterval(cutCount, 1000)
    }
    /**
     * 显示语音输入弹窗
     */
    const showVoicePop = (status, cancelStatus, type?, locationY?) => {
        if (type == 'new') {
            setTooShort(false)
            clearInterval(timerRef.current)
            setCount(timerCount)
            countDown()
            setPopShow(status)
            setPressMove(cancelStatus)
        } else if (type == 'end') {
            if (locationY <= -10) {
                setTimeout(() => {
                    Tiga.Media.cancelVoiceRecognize({
                        context: context,
                    })
                }, 100)
            } else {
                setTimeout(() => {
                    Tiga.Media.stopVoiceRecognize({
                        context: context,
                    })
                }, 100)
            }
            if (countRef.current > 58) {
                console.log(smartChatToastInfo?.durationIsTooShort)
                setTooShort(true)
                setPressMove(cancelStatus)
                setTimeout(() => {
                    setPopShow(status)
                }, 500)
            } else {
                setPopShow(status)
                setPressMove(cancelStatus)
            }
        } else {
            setPopShow(status)
            setPressMove(cancelStatus)
        }

        if (status == false) {
            clearInterval(timerRef.current)
            setCount(timerCount)
        }
    }

    const endVoice = () => {
        setPressStatus(false)
        props?.showVoicePop(false, false)
        setShowText('按住说话')
        voiceIntRef.current = false
        Tiga.Media.stopVoiceRecognize({
            context: context,
        })
    }
    // ----------------------------------------------------------------------
    //如果真的发语音了，那么发给store使得其接受到更新
    useEffect(() => {
        if (constructParam?.sendMessageText) {
            const sendText = JSON.parse(decodeURIComponent(constructParam?.sendMessageText))
            if (sendText) {
                setTimeout(() => {
                    sendMessageCheck(sendText)
                }, 1000)
                dispatch(updateConstructParams({ ...constructParam, sendMessageText: '' }))
            }
        }
    }, [constructParam?.sendMessageText])
    //检测键盘状态，如果有更新那么就直接跳转
    useEffect(() => {
        Taro.onKeyboardHeightChange(res => {
            if (res?.height > 0) {
                eventCenter.dispatchEvent(
                    EventName.intelligence_chat_message_scroll_to_end,
                    {},
                    { context }
                )
            }
        }, context)
    }, [])
    //寻找是否是货主，如果是的话那么就更新其的状态
    useEffect(() => {
        if (loadingNewGrey) {
            //eventType来判断其到底是否是货主介入
            const lastShipper = messageList
                .slice()
                .reverse()
                .find(item => item.ext?.eventType == 'shipperIn')
            setIsShipperIn(props?.shipperIn === '1' || (!!lastShipper && lastShipper.ext?.shipperIn == 1))
        } else {
            const lastShipper = messageList
                .slice()
                .reverse()
                .find(item => item.fromUid == assistantId)

            setIsShipperIn(
                !!lastShipper &&
                (lastShipper?.ext?.shipperInActiveTextFlag === 1 ||
                    lastShipper?.ext?.shipperMessageFlag == 1)
            )
        }
        //使得ai不再加载
        if (isShipperIn) {
            dispatch(updateAILoading(false))
        }
    }, [messageList.length, assistantId, props?.shipperIn, loadingNewGrey])

    useEffect(() => {
        CargoKeyboard.addListener(context, keyboardListener)

        return () => {
            CargoKeyboard.removeListener(context, keyboardListener)
        }
    }, [])

    const keyboardListener = res => {
        setIsKeyBoaredPop(!!res?.height)
    }

    useImperativeHandle(props.myref, () => {
        return {
            endVoice: () => {
                setPressStatus(false)
                props?.showVoicePop(false, false)
                setShowText('按住说话')
                voiceIntRef.current = false
                Tiga.Media.stopVoiceRecognize({
                    context: context,
                })
            },
        }
    })
    //监听机制
    const listener = useCallback(val => {
        console.log(val, '识别回调')
        if (val.code == '1' && val.filePath && val.text) {
            console.log('回调code为1')
            Tiga.Network.uploadFiles({
                context: context,
                timeout: 1000,
                files: [
                    {
                        bizType: 'diPub',
                        localPath: val.filePath,
                    },
                ],
                success(res) {
                    Track.tap('voice_input_button', {
                        pageName: 'AI_assistant_chat_box',
                        region: 'voice_input',
                        extra: {
                            asrRT: val?.identifyTime || Date.now() - beginTime.current,
                            releaseTime: releaseTime.current,
                            cargoid: params.cargoId,
                        },
                        context,
                    })
                    console.log('asrRT', Date.now() - beginTime.current)
                    sendSoundMessageCheck(val.text, res?.ossFileList[0]?.absoluteUrl, val.duration)
                    console.log('uploadFiles success: ', res.ossFileList[0].absoluteUrl)
                },
                fail(res) {
                    console.log('uploadFiles fail: ', res)
                    Taro.showToast({
                        title: smartChatToastInfo?.asrexception || '系统繁忙，请稍后重试',
                        context,
                    })
                    trackError(0, '文件上传失败')
                    return
                },
            })
        } else if ((val.code == '1' && val.text == '') || val.code == '20' || val.code == '21') {
            trackError(0, 'sdk识别错误')
            Taro.showToast({
                title: smartChatToastInfo?.didntHearClearly || '小助理没听清，请再说一遍哦',
                context,
            })
            return
        }
    }, [])

    const trackError = (isSuccess, text) => {
        UniBridge.call('app.base.track', {
            type: 'monitor',
            module: 'cargo',
            monitorData: {
                event: 2,
                metric: {
                    value: '1',
                    type: '0',
                    name: 'send_sound_message_success',
                    tags: {
                        isSuccess: isSuccess,
                        reason: text,
                    },
                },
            },
            context: context,
        })
    }
    useEffect(() => {
        // 展开收起按钮曝光
        Track.viewOnce('SQZKAN', {
            pageName: 'AI_assistant_chat_box',
            region: 'YSWTBT',
            extra: {},
            context,
        })
        Track.viewOnce('xxfs', {
            pageName: 'AI_assistant_chat_box',
            region: 'XXSR',
            extra: {},
            context,
        })
        Track.viewOnce('WTSRK', {
            pageName: 'AI_assistant_chat_box',
            region: 'XXSR',
            extra: {},
            context,
        })
        Tiga.Permission.checkPermission({
            context: context,
            permission: Tiga.Permission.Permissions.microphone,
        })
            .then(res => {
                console.log('Tiga.Permission.checkPermission', res)
                setRecordPowerStatus(res?.status)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    useEffect(() => {
        if (!frequentlyQuestionListVisible) {
            setSelectedTag('')
        }
    }, [frequentlyQuestionListVisible])

    useEffect(() => {
        if (rtcVoiceCallGrey) {
            Track.viewOnce('voice_call_button', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_call_button',
                extra: {},
                context,
            })
        }
        if (smartChatConfigInfo?.smartVoiceDriverGray && smartChatConfigInfo?.voiceInput === 'on') {
            setMessageType(smartChatConfigInfo?.lastChatType || 'voice')
            if (smartChatConfigInfo?.lastChatType == 'text') {
                Track.viewOnce('voice_switch', {
                    pageName: 'AI_assistant_chat_box',
                    region: 'voice_switch',
                    extra: {},
                    context,
                })
            } else {
                Track.viewOnce('voice_input_button', {
                    pageName: 'AI_assistant_chat_box',
                    region: 'voice_input',
                    extra: {},
                    context,
                })
                Track.viewOnce('text_switch_button', {
                    pageName: 'AI_assistant_chat_box',
                    region: 'voice_switch',
                    extra: {},
                    context,
                })
            }
        } else {
            setMessageType(smartChatConfigInfo?.lastChatType || 'text')
        }
    }, [smartChatConfigInfo])

    useEffect(() => {
        let filtershowIssues: any = []
        if (selectedTag || questionText) {
            filtershowIssues =
                issueTips
                    ?.find?.(it => it.name === (selectedTag || '全部'))
                    ?.questions?.filter(q => q.question?.includes?.(questionText)) ?? []
        }
        let padding = 220
        if (filtershowIssues?.length > 2) {
            padding = 470
        } else if (filtershowIssues?.length === 2) {
            padding = 380
        } else if (filtershowIssues?.length === 1) {
            padding = 300
        }
        dispatch(updateMessageScrolllViewPaddingBottom(padding))
        setShowIssues(filtershowIssues)
    }, [selectedTag, questionText, updateMessageScrolllViewPaddingBottom])
    //sendSoundMessageCheck 函数用于触发协议检查，决定是否发送语音消息或文本消息
    const sendSoundMessageCheck = (question?: string, voiceUrl?: string, voiceDuration?: string) => {
        dispatch(checkProctocal(2, context, sendSoundMessage, question, voiceUrl, voiceDuration))
    }
    const sendSoundMessage = debounce(
        async (question?: string, voiceUrl?: string, voiceDuration?: string) => {
            // 1000ms内不可重复点击发送
            if (Date.now() - sendMessageTimestamp.current < 2000) return
            sendMessageTimestamp.current = Date.now()
            try {
                if (!question) {
                    Taro.showToast({
                        title: '请输入问题',
                        context,
                    })
                    return
                }
                if (showAILoadingRef.current) {
                    Taro.showToast({
                        title: smartChatToastInfo?.noResponseReceived || '助理正在回答问题，请稍后再试',
                        context,
                    })
                    return
                }
                if (!cargoStatusValid) {
                    Taro.showToast({
                        title: '货源已下架，看看其他货吧',
                        context,
                    })
                    return
                }
                // 如果上条消息未返回，不在发送消息
                // if (!messageList?.[messageList?.length - 1]?.outSeqId) {
                //   return
                // }
                Taro.hideKeyboard({ context })
                Track.tap('xxfs', {
                    pageName: 'AI_assistant_chat_box',
                    region: 'XXSR',
                    extra: {},
                    context,
                })
                const tempQuestionText = question
                messageListRef.current?.push({
                    outSeqId: '',
                    cargoId: params.cargoId,
                    fromUid: userId,
                    toUid: assistantId,
                    base: {
                        chatType: 'chat',
                        content: {
                            content: tempQuestionText,
                        },
                        type: 'txt',
                        msgStatus: 2,
                        readTime: 0,
                        replySeqID: '',
                        bidStateMsg: '',
                    },
                    ext: {
                        diChatRobotResponse: false,
                        voiceUrl: voiceUrl,
                        voiceDuration: Number(voiceDuration),
                    },
                    isHideCardButton: false,
                })
                dispatch(
                    updateMessageListAndLoading({
                        messageList: messageListRef.current,
                        showAILoading: !isShipperIn,
                    })
                )
                setQuestionText('')
                setInputKey(v => v + 1)
                setTimeout(
                    () =>
                        eventCenter.dispatchEvent(
                            EventName.intelligence_chat_message_scroll_to_end,
                            {},
                            { context }
                        ),
                    300
                )
                const result = await Request.sendSmartChatMessage(
                    {
                        chatRecordId: params.chatRecordId,
                        cargoId: params.cargoId,
                        base: {
                            chatType: 'chat',
                            content: tempQuestionText,
                            voiceUrl: voiceUrl,
                            voiceDuration: voiceDuration,
                            conversationType: 10001,
                        },
                        ext: {
                            // voiceCallId: rtcVoiceCallGrey ? '' : props.voiceCallId || '',
                        },
                        shipperRemarkV2: 1,
                        hasMicrophoneAuthorization: recordPowerStatus == 1,
                    },
                    context
                )
                if (result.result === 1) {
                    // 更新发送结果
                    // dispatch(updateSendMsgResult(true))
                    closeList()
                    messageListRef.current[messageListRef.current.length - 1].outSeqId = result.data.outSeqId

                    // 增加文字纠错
                    if (result?.data?.correctText) {
                        messageListRef.current[messageListRef.current.length - 1].base.content.content =
                            result?.data?.correctText
                    }

                    dispatch(updateMessageList(messageListRef.current)) // 更新消息的outSeqId
                } else {
                    // dispatch(updateSendMsgResult(false))
                    messageListRef.current[messageListRef.current.length - 1].failSeqId = Date.now() + ''
                    dispatch(updateMessageList(messageListRef.current)) // failSeqId
                    dispatch(updateAILoading(false))
                    Taro.showToast({
                        title: result?.errorMsg ?? '发送失败',
                        context,
                    })
                    if (isVoiceCall) {
                        eventCenter.dispatchEvent(
                            EventName.intelligence_chat_start_voice_recognize,
                            {},
                            { context }
                        )
                    }
                }

                setTimeout(
                    () =>
                        eventCenter.dispatchEvent(
                            EventName.intelligence_chat_message_scroll_to_end,
                            {},
                            { context }
                        ),
                    300
                )
            } catch {
                // dispatch(updateSendMsgResult(false))
                messageListRef.current[messageListRef.current.length - 1].failSeqId = Date.now() + ''
                dispatch(updateMessageList(messageListRef.current)) // failSeqId
                dispatch(updateAILoading(false))
                Taro.showToast({
                    title: '发送失败',
                    context,
                })
            }
        },
        100,
        {
            leading: true,
            trailing: false,
        }
    )
    const sendMessageCheck = (question?: string) => {
        dispatch(checkProctocal(0, context, sendMessage, question))
    }

    const sendMessage = useCallback(
        async (question?: string) => {
            if (rtcV3OnlineStatus === 'on') {
                Taro.showToast({
                    title: '当前正在通话，请挂断后操作',
                    context,
                })
                return
            }
            // 1000ms内不可重复点击发送
            if (Date.now() - sendMessageTimestamp.current < 2000) return
            sendMessageTimestamp.current = Date.now()

            try {
                //如果输入信息为空
                if (!question?.trim() && !questionText?.trim()) {
                    Taro.showToast({
                        title: '不能发送空白消息',
                        context,
                    })
                    return
                }
                if (showAILoading) {
                    Taro.showToast({
                        title: smartChatToastInfo?.noResponseReceived || '助理正在回答问题，请稍后再试',
                        context,
                    })
                    return
                }
                if (!cargoStatusValid) {
                    Taro.showToast({
                        title: '货源已下架，看看其他货吧',
                        context,
                    })
                    return
                }
                // 如果上条消息未返回，不在发送消息
                // if (!messageList?.[messageList?.length - 1]?.outSeqId) {
                //   return
                // }
                Taro.hideKeyboard({ context })
                Track.tap('xxfs', {
                    pageName: 'AI_assistant_chat_box',
                    region: 'XXSR',
                    extra: {},
                    context,
                })
                const tempQuestionText = question ? question : questionText
                messageList.push({
                    outSeqId: '',
                    cargoId: params.cargoId,
                    fromUid: userId,
                    toUid: assistantId,
                    base: {
                        chatType: 'chat',
                        content: { content: tempQuestionText },
                        type: 'txt',
                        msgStatus: 2,
                        readTime: 0,
                        replySeqID: '',
                        bidStateMsg: '',
                    },
                    ext: {
                        diChatRobotResponse: false,
                    },
                    isHideCardButton: false,
                })
                dispatch(
                    updateMessageListAndLoading({
                        messageList,
                        showAILoading: !isShipperIn,
                    })
                )
                setQuestionText('')
                setInputKey(v => v + 1)
                setTimeout(
                    () =>
                        eventCenter.dispatchEvent(
                            EventName.intelligence_chat_message_scroll_to_end,
                            {},
                            { context }
                        ),
                    300
                )
                //对信息进行发送
                const result = await Request.sendSmartChatMessage(
                    {
                        chatRecordId: params.chatRecordId,
                        cargoId: params.cargoId,
                        base: {
                            chatType: 'chat',
                            content: tempQuestionText,
                            conversationType: 10001,
                        },
                        shipperRemarkV2: 1,
                        hasMicrophoneAuthorization: recordPowerStatus == 1,
                    },
                    context
                )
                if (result.result === 1) {
                    // 更新发送结果
                    // dispatch(updateSendMsgResult(true))
                    closeList()
                    messageList[messageList.length - 1].outSeqId = result.data.outSeqId
                    dispatch(updateMessageList(messageList)) // 更新消息的outSeqId
                } else {
                    //发送失败
                    // dispatch(updateSendMsgResult(false))
                    messageList[messageList.length - 1].failSeqId = Date.now() + ''
                    dispatch(updateMessageList(messageList)) // failSeqId
                    dispatch(updateAILoading(false))
                    Taro.showToast({
                        title: result?.errorMsg ?? '发送失败',
                        context,
                    })
                }
                setTimeout(
                    () =>
                        eventCenter.dispatchEvent(
                            EventName.intelligence_chat_message_scroll_to_end,
                            {},
                            { context }
                        ),
                    300
                )
            } catch {
                // dispatch(updateSendMsgResult(false))
                messageList[messageList.length - 1].failSeqId = Date.now() + ''
                dispatch(updateMessageList(messageList)) // failSeqId
                dispatch(updateAILoading(false))
                setTimeout(
                    () =>
                        eventCenter.dispatchEvent(
                            EventName.intelligence_chat_message_scroll_to_end,
                            {},
                            { context }
                        ),
                    300
                )
                Taro.showToast({
                    title: '发送失败',
                    context,
                })
            }
        },
        [questionText, params, showAILoading, messageList, cargoStatusValid, rtcV3OnlineStatus]
    )

    const handleClickPhoneIcon = async () => {
        const voiceId = `v3_${params.cargoId}${Date.now()}`
        Track.tap('voice_call_button', {
            pageName: 'AI_assistant_chat_box',
            region: 'voice_call_button',
            extra: {
                cargoid: params.cargoId,
                rtc_type: rtcCode || 1,
                voiceCallID: voiceId,
            },
            context,
        })
        if (rtcV3OnlineStatus === 'on') {
            UniBridge.call('di.chat.switchFloatViewToPage', { context })
            return
        }
        if (phoneClickResponsed) {
            Logger.log('rtc---clickPhone-blocked', context)
            Toast.show({ title: '操作太频繁啦，请稍后再试' })
            return
        }
        Logger.log('rtc---clickPhone-through', context)
        dispatch(updatePhoneClickResponsed(true))
        const key = `rtcButtonTip_${params.cargoId}_${driverId}`
        // 已点击过电话按钮 -ForButtonTip
        UniBridge.call('app.storage.setItem', {
            context,
            key,
            text: 1,
        })
        audioContextRef.current?.stop()
        dispatch(updateTtsOutSeqId(''))
        dispatch(updateTtsWaitList([]))
        audioContextRef.current?.destroy()
        Taro.hideKeyboard({ context })
        openVoiceCallAndCheckPower(voiceId)
    }
    //获取其的令牌
    const handleBlockAndPrepareCallAsync = async (voiceId: string) => {
        // 本地同步检查货源状态
        console.log(cargoStatusValid)
        if (!cargoStatusValid) {
            Track.tap('voiceCallEntranceClickVerificationFailed', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_call_page',
                extra: {
                    cargoid: params.cargoId,
                    rtc_type: rtcCode || 1,
                    voiceCallID: voiceId,
                },
                context,
            })
            Taro.showToast({
                title: '货源已下架，看看其他货吧',
                context,
            })
            return false
        }
        // 获取token
        let RTCSwitch = await DiStorage.getItemByUserStorage({
            context,
            key: 'rtcV3Switch',
        })
        if (RTCSwitch !== 'on') {
            dispatch(getRtcParams(props.onCallOffRtc, voiceId, context))
        }
        return true
    }

    /**
     * 检查权限并唤起通话
     */
    const openVoiceCallAndCheckPower = voiceId => {
        // 校验麦克风权限
        if (recordPowerStatus == 1) {
            if (!handleBlockAndPrepareCallAsync(voiceId)) {
                return
            }
            props?.openVoiceCall(voiceId, 'activeCall')
            closeList()
        } else {
            Tiga.Permission.requestPermission({
                context: context,
                permission: Tiga.Permission.Permissions.microphone,
                rationale: inIOS
                    ? '麦克风权限已经关闭，为确保语音输入功能的正常使用，请您点击【去开启】，在设置页面开启麦克风权限'
                    : '麦克风权限已经关闭，为确保语音输入功能的正常使用，APP需申请麦克风权限',
                topHint: '',
            }).then(res => {
                Logger.log('rtc------requestPermission microphone', context)
                dispatch(updatePhoneClickResponsed(false))
                Track.viewOnce('microphone_authorization_result', {
                    pageName: 'AI_assistant_chat_box',
                    region: 'microphone_authorization',
                    extra: {
                        authorization_status: recordPowerStatus == 1 ? 1 : 2,
                        microphone_authorization_source: 2,
                        reuqestid: '',
                        voiceCallID: voiceId,
                    },
                    context,
                })
                console.log('权限请求', res)
                setRecordPowerStatus(res?.status)

                if (res?.status == 1) {
                    Track.tap('microphone_authorization_result', {
                        pageName: 'AI_assistant_chat_box',
                        region: 'microphone_authorization',
                        extra: {
                            authorization_status: 1,
                            microphone_authorization_source: 2,
                            reuqestid: '',
                            voiceCallID: voiceId,
                        },
                        context,
                    })
                    if (!handleBlockAndPrepareCallAsync(voiceId)) {
                        return
                    }
                    props?.openVoiceCall(voiceId, 'activeCall')
                    closeList()
                } else {
                    Track.tap('microphone_authorization_result', {
                        pageName: 'AI_assistant_chat_box',
                        region: 'microphone_authorization',
                        extra: {
                            authorization_status: 2,
                            microphone_authorization_source: 2,
                            reuqestid: '',
                            voiceCallID: voiceId,
                        },
                        context,
                    })
                    dispatch(
                        updateChatConfig(
                            {
                                lastChatType: 'text',
                            },
                            context
                        )
                    )
                    setMessageType('text')
                }
            })
        }
    }

    const hidePopover = () => {
        Track.tap('education_shadow_2', {
            pageName: 'AI_assistant_chat_box',
            region: 'education_phase_two',
            extra: {
                cargo_id: params.cargoId,
            },
            context: context,
        })
        popRef?.current?.hide?.()
        Track.view('regionview_stay_duration', {
            pageName: 'AI_assistant_chat_box',
            region: 'education_phase_two',
            extra: {
                stay_duration: popoverTime
                    ? ((Date.now() - popoverTime.current) / 1000).toFixed(2)
                    : 'null',
            },
            context: context,
        })
        const key = 'inteligence_chat_' + userId
        UniBridge.call('app.storage.setItem', {
            context,
            text: 1,
            key,
        })
        dispatch(updateGuideDataLogic({ guideStep: guideStep + 1 }))
    }
    const popoverTime = useRef(0)
    useEffect(() => {
        const guideCompName = guideStepData?.[guideStep - 1]?.name
        if (guideCompName === GuideCompNameEnum.VOICE_INPUT) {
            popRef?.current?.show?.()
            Track.viewOnce('regionview', {
                pageName: 'AI_assistant_chat_box',
                region: 'education_phase_two',
                extra: {},
                context: context,
            })
            Track.viewOnce('education_shadow_2', {
                pageName: 'AI_assistant_chat_box',
                region: 'education_phase_two',
                extra: {
                    cargo_id: params.cargoId,
                },
                context: context,
            })
            popoverTime.current = Date.now()
        }
    }, [guideStep])

    const { screenHeight } = Taro.getSystemInfoSync()
    const handleClickSwitchIcon = () => {
        if (rtcV3OnlineStatus === 'on') {
            Taro.showToast({
                title: '当前正在通话，请挂断后操作',
                context,
            })
            return
        }
        if (messageType == 'text') {
            Track.tap('voice_switch', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_switch',
                extra: {},
                context,
            })
            Track.viewOnce('text_switch_button', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_switch',
                extra: {},
                context,
            })
            Track.viewOnce('voice_input_button', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_input',
                extra: {},
                context,
            })

            Taro.hideKeyboard({ context })
            dispatch(
                updateChatConfig(
                    {
                        lastChatType: 'voice',
                    },
                    context
                )
            )
            setMessageType('voice')
        } else {
            Track.tap('text_switch_button', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_switch',
                extra: {},
                context,
            })
            Track.viewOnce('voice_switch', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_switch',
                extra: {},
                context,
            })
            dispatch(
                updateChatConfig(
                    {
                        lastChatType: 'text',
                    },
                    context
                )
            )
            setMessageType('text')
            setTimeout(() => {
                textInputRef?.current?.focus()
            }, 100)
        }
    }

    // 快捷回复
    const questionlist = searchConfig?.quickReply?.replyOptions
    const questionTitle = searchConfig?.quickReply?.title
    const [showQuestionList, setShowQuestionList] = useState(false)

    // lion 配置下发响应
    useEffect(() => {
        handleShowReplyOptions(searchConfig)
    }, [searchConfig])

    //  是否展示快捷回复选项
    const handleShowReplyOptions = (searchConfig?: searchConfigDto) => {
        if (!!searchConfig?.quickReply)
            if (
                searchConfig.quickReply?.replyOptions &&
                searchConfig.quickReply?.replyOptions?.length > 0
            ) {
                UniBridge.call('app.storage.getItem', {
                    key: params.cargoId + 'quickReply_disappear' + userId,
                    context: context,
                }).then(data => {
                    console.log('getItem', data)
                    if (data && data.code == 0 && !data.data?.text) {
                        Track.viewOnce('Q_answer', {
                            pageName: 'AI_assistant_chat_box',
                            region: 'quick_answer',
                            extra: {
                                answer_choice: searchConfig.quickReply?.replyOptions,
                                cargo_id: params.cargoId,
                            },
                            context,
                        })
                        setShowQuestionList(true)
                    }
                })
            }
    }

    const closeList = () => {
        setShowQuestionList(false)
        UniBridge.call('app.storage.setItem', {
            key: params.cargoId + 'quickReply_disappear' + userId,
            context: context,
            text: params.cargoId + 'quickReply_disappear' + userId,
        })
    }

    const renderQuestion = () => {
        return questionlist && questionlist.length > 0 && showQuestionList ? (
            <View className={styles['question-content']}>
                <View className={styles['question-title']}>{questionTitle}</View>
                <ScrollView scrollX className={styles['question-list']}>
                    {questionlist?.map(item => {
                        return (
                            <View
                                className={styles['question-list-item']}
                                onClick={debounce(
                                    () => {
                                        Track.tap('Q_answer', {
                                            pageName: 'AI_assistant_chat_box',
                                            region: 'quick_answer',
                                            extra: {
                                                answer_choice: item,
                                                cargo_id: params.cargoId,
                                            },
                                            context,
                                        })
                                        closeList()
                                        sendMessageCheck(item)
                                    },
                                    100,
                                    {
                                        leading: true,
                                        trailing: false,
                                    }
                                )}
                            >
                                {item}
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        ) : null
    }

    const handleShowRtcButtonTip = () => {
        const key = `rtcButtonTip_${params.cargoId}_${driverId}`
        UniBridge.call('app.storage.getItem', {
            context,
            key,
        }).then(res => {
            if (!res.data?.text) {
                setShowButtonTip(true)
            } else {
                setShowButtonTip(false)
            }
        })
    }
    useEffect(() => {
        if (
            !!searchConfig?.rtcConfig?.callButtonBubbleText &&
            rtcVoiceCallGrey &&
            !questionText?.trim() &&
            !!params.cargoId &&
            !!driverId
        ) {
            handleShowRtcButtonTip()
        }
    }, [
        rtcVoiceCallGrey,
        questionText,
        searchConfig,
        params,
        driverId,
        isVoiceCallRtc,
        rtcV3OnlineStatus,
    ])

    const PhoneButtonMemo = useMemo(() => {
        return (
            <>
                {rtcVoiceCallGrey && !questionText?.trim() && pluginVersionCode ? (
                    <>
                        <View
                            className={styles.phoneView}
                            onClick={debounce(
                                () => {
                                    handleClickPhoneIcon()
                                },
                                500,
                                {
                                    leading: true,
                                    trailing: false,
                                }
                            )}
                        >
                            {rtcV3OnlineStatus === 'on' ? (
                                <Image src={ImageIndex.ai_chat_phone_icon_gif} className={styles.phoneIcon} />
                            ) : (
                                <Image src={ImageIndex.ai_chat_phone_icon} className={styles.phoneIcon} />
                            )}
                            {showButtonTip ? (
                                <View className={styles.phoneIconTip}>
                                    <Text className={styles.phoneIconTipText}>
                                        {searchConfig?.rtcConfig?.callButtonBubbleText}
                                    </Text>
                                    <View className={styles.arrow}></View>
                                </View>
                            ) : null}
                        </View>
                    </>
                ) : (
                    <Button
                        className={styles.sendButton}
                        plain
                        textStyle={{ fontSize: pxTransform(28), fontWeight: '500' }}
                        onClick={() => {
                            Track.tap('xxfs', {
                                pageName: 'AI_assistant_chat_box',
                                region: 'XXSR',
                                extra: {
                                    textInputTime: Date.now(),
                                    cargoid: params.cargoId,
                                },
                                context,
                            })
                            dispatch(updateFrequentlyQuestionListVisible(false))
                            sendMessageCheck()
                        }}
                    >
                        发送
                    </Button>
                )}
            </>
        )
    }, [
        rtcVoiceCallGrey,
        questionText,
        searchConfig,
        showButtonTip,
        recordPowerStatus,
        pluginVersionCode,
        rtcV3OnlineStatus,
    ])

    /**
     * 按钮按下事件
     * @param event
     * @returns
     */
    const onPointerDownPress = debounce(
        event => {
            if (rtcV3OnlineStatus === 'on') {
                Taro.showToast({
                    title: '当前正在通话，请挂断后操作',
                    context,
                })
                return
            }
            Track.tap('voice_input_button', {
                pageName: 'AI_assistant_chat_box',
                region: 'voice_input',
                extra: {},
                context,
            })

            if (!showAILoadingRef.current && recordPowerStatus == 1) {
                voiceIntRef.current = true
            } else if (recordPowerStatus !== 1) {
                Track.viewOnce('microphone_authorization_result', {
                    pageName: 'AI_assistant_chat_box',
                    region: 'microphone_authorization',
                    extra: {
                        authorization_status: recordPowerStatus == 1 ? 1 : 2,
                        microphone_authorization_source: 1,
                    },
                    context,
                })
                Tiga.Permission.requestPermission({
                    context: context,
                    permission: Tiga.Permission.Permissions.microphone,
                    rationale: inIOS
                        ? '麦克风权限已经关闭，为确保语音输入功能的正常使用，请您点击【去开启】，在设置页面开启麦克风权限'
                        : '麦克风权限已经关闭，为确保语音输入功能的正常使用，APP需申请麦克风权限',
                    topHint: '',
                }).then(res => {
                    console.log('权限请求', res)
                    setRecordPowerStatus(res?.status)
                    Track.tap('microphone_authorization_result', {
                        pageName: 'AI_assistant_chat_box',
                        region: 'microphone_authorization',
                        extra: {
                            authorization_status: res?.status == 1 ? 1 : 2,
                            microphone_authorization_source: 1,
                        },
                        context,
                    })
                    if (res?.status == 0) {
                        dispatch(
                            updateChatConfig(
                                {
                                    lastChatType: 'text',
                                },
                                context
                            )
                        )
                        setMessageType('text')
                    }
                })
                return
            } else if (showAILoadingRef.current) {
                Taro.showToast({
                    title: smartChatToastInfo?.noResponseReceived || '助理正在回答问题，请稍后再试',
                    context,
                })
                return
            }

            audioContextRef?.current?.stop()

            dispatch(updateTtsOutSeqId(''))
            dispatch(updateTtsWaitList([]))

            audioContextRef?.current?.destroy()
            dispatch(updateAudioContext(null))
            if (voiceSpeakerTokenRef?.current) {
                voiceSpeakerRef?.current?.stop({ token: voiceSpeakerTokenRef?.current })
            }
            dispatch(
                updateVoiceSpeaker({
                    voiceSpeakerToken: '',
                    voiceSpeakerSeqId: '',
                })
            )
            Tiga.Media.startVoiceRecognize({
                context: context,
                permissionRequest: true,
                callBack: listener,
                afterOverTime: 60,
            })
            console.warn('======onLongPressStart', event.nativeEvent)
            setPressStatus(true)
            showVoicePop(true, false, 'new')
            setShowText('松开发送')
        },
        500,
        {
            leading: true,
            trailing: false,
        }
    )

    /**
     * 按钮移动事件
     * @param event
     * @returns
     */
    const onPointerMovePress = event => {
        if (voiceIntRef.current) {
            console.warn('======onLongPressMove', event.nativeEvent)
            if (showAILoadingRef.current) {
                return
            }
            // 向上移动超过本组件20才能触发松开取消，如需要移动一定距离触发可使用moveY
            if (event.nativeEvent.locationY <= -10) {
                setShowText('取消发送')
                showVoicePop(true, true)
            } else {
                setShowText('松开发送')
                showVoicePop(true, false)
            }
        }
    }

    /**
     * 按钮抬起事件
     * @param event
     * @returns
     */
    const onPointerUpPress = event => {
        if (voiceIntRef.current) {
            releaseTime.current = Date.now()
            beginTime.current = Date.now()
            console.warn('======onLongPressEnd', event.nativeEvent)
            console.log('event.nativeEvent.locationY', event.nativeEvent.locationY)
            if (showAILoading) {
                return
            }
            setPressStatus(false)
            showVoicePop(false, false, 'end', event.nativeEvent.locationY)
            setShowText('按住说话')
            voiceIntRef.current = false
        }
    }

    return (
        <View className={styles['footer']}>
            <VoiceInputPop popShow={popShow} tooShort={tooShort} pressMove={pressMove} count={count} />
            {renderQuestion()}
            <Popover.MeasureView
                ref={popRef}
                overlay
                overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                onOverlayClick={hidePopover}
                render={rect => {
                    return (
                        <Image
                            src={guideStepData?.[guideStep - 1]?.data}
                            style={{
                                bottom: screenHeight - rect.bottom + pxTransform(20),
                                left: rect.left + +pxTransform(14),
                                position: 'absolute',
                                height: pxTransform(207),
                                width: pxTransform(680),
                            }}
                            onClick={hidePopover}
                            className={styles.guide}
                        />
                    )
                }}
            >
                <View className={styles['send-message-wrap']}>
                    {smartChatConfigInfo?.smartVoiceDriverGray && smartChatConfigInfo?.voiceInput === 'on' ? (
                        <Image
                            src={
                                messageType == 'text'
                                    ? 'https://imagecdn.ymm56.com/ymmfile/static/resource/1428925d-1c9b-4951-ba3a-8070aee54dfc.png'
                                    : 'https://imagecdn.ymm56.com/ymmfile/static/resource/0cd5e153-d66b-46e9-8817-4443439be133.png'
                            }
                            className={styles['icon-wrap']}
                            onClick={handleClickSwitchIcon}
                        />
                    ) : null}

                    {messageType == 'text' ? (
                        <View className={styles['inputwrap']}>
                            <Input
                                ref={textInputRef}
                                key={String(inputKey)}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#FFFFFF',
                                    fontSize: Taro.pxTransform(28),
                                }}
                                value={questionText}
                                placeholder='您可以询问任意关于货源的问题'
                                placeholderTextColor='#CCCCCC'
                                // @ts-ignore
                                _multiline
                                blurOnSubmit
                                _autoHeight
                                confirmType='send'
                                maxlength={200}
                                onFocus={() => {
                                    if (rtcV3OnlineStatus === 'on') {
                                        Taro.showToast({
                                            title: '当前正在通话，请挂断后操作',
                                            context,
                                        })
                                        return
                                    }
                                    hideTooltipRef.current?.()
                                }}
                                onBlur={() => {
                                    Track.tap('WTSRK', {
                                        pageName: 'AI_assistant_chat_box',
                                        region: 'XXSR',
                                        extra: {},
                                        context,
                                    })
                                    hideTooltipRef.current?.()
                                }}
                                onConfirm={e => {
                                    dispatch(updateFrequentlyQuestionListVisible(false))
                                    sendMessageCheck()
                                }}
                                onInput={e => {
                                    dispatch(updateFrequentlyQuestionListVisible(true))
                                    setQuestionText(e?.detail?.value ?? '')
                                    // searchQuestion()
                                }}
                            />
                        </View>
                    ) : (
                        <View
                            className={pressStatus ? styles['inputwrapPress'] : styles['inputwrapVoice']}
                            // @ts-ignore
                            onPointerDown={onPointerDownPress}
                            onPointerMove={onPointerMovePress}
                            onPointerUp={onPointerUpPress}
                            syncListeningMode
                        >
                            <View
                                style={{
                                    height: Taro.pxTransform(88),
                                    width: Taro.pxTransform(500),
                                    borderRadius: Taro.pxTransform(12),
                                    justifyContent: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <View className={styles['voice-text']}>{showText}</View>
                            </View>
                        </View>
                    )}
                    {PhoneButtonMemo}
                </View>
            </Popover.MeasureView>

            {isKeyBoaredPop ? null : (
                <View
                    style={{
                        height: pxTransform(ExtendUtils.isIphoneX() ? 46 : 24),
                    }}
                />
            )}
        </View>
    )
}