import eventCenter from '@fta/apis-event-center'
import PageLoadContainer from '@fta/cargomatch-page-loading-container'
import {
    ActionSheet,
    ButtonGroup,
    Flex,
    Gradient,
    Icon,
    Modal,
    NavBar,
    Popover,
    SafeArea,
    Text,
    TouchableOpacity,
    inIOS,
    scale,
    useModal,
    withLayer,
} from '@fta/components'

import { useBeforePop, useLatest } from '@fta/hooks'
import Tiga from '@fta/tiga'
import { Bridge } from '@fta/uni-bridge'
import { Image, RichText, View } from '@tarojs/components'
import Taro, { createInnerAudioContext, pxTransform, useDidHide, useDidShow } from '@tarojs/taro'
import { appInfo as myApp } from '@thresh/thresh-component'
import { Animated } from '@thresh/thresh-lib'
import { debounce, isNull, isUndefined } from 'lodash-es'
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import schemeJump from 'src/api/openSchema'
import Track from 'src/api/track'
import useThreshContext from 'src/api/useThreshContext'
import Network from 'src/network/intelligence-chat'
import { createReduxPage } from 'src/store'
import { Platform } from 'src/utils'
import { EventName, OpType, PageUrl } from 'src/utils/const'
import DiStorage from 'src/utils/DiStorageUtil'
import { Logger } from 'src/utils/log'
import { isAuthPrivateNum, openPrivateNumModal, showAuthModal } from 'src/utils/public-capacity'
import { appendParamsToUrl } from 'src/utils/url'
import images from '../../assets/index'
import AiNoticeAuthCardBanner from './biz-components/ai-notice-auth-card-banner'
import BackDialogFooter from './biz-components/back-dialog-footer'
import CallRtcModal from './biz-components/call-rtc-modal'
import CargoDetailCardNew from './biz-components/cargo-detail-card-new'
import ChatMessage from './biz-components/chat-message'
import FrequentlyQuestionsList from './biz-components/frequently-questions-list'
import MoreBubble from './biz-components/more-icon-bubble'
import TelephoneCardBanner from './biz-components/telephone-card-banner'
import UserFeedback from './biz-components/user-feedback'
import { RtcOffModalSourceEnum, SwitchStatueEnum } from './enum'
import styles from './index.module.scss'
import {
    clearState,
    fetchMessageList,
    fetchPageData,
    getLatestOutSeqId,
    getLionConfig,
    getRtcParams,
    rtcOffBlockModalRegionview,
    trackErrorRtc,
    updateConstructParams,
    updateDriverDetailToCall,
    updateFastOpen,
    updateFrequentlyQuestionListVisible,
    updateGreetingTtsUrl,
    updateHasNewMessage,
    updateLoading,
    updateMessageList,
    updateNoread,
    updateParams,
    updatePhoneClickResponsed,
    updateRequestId,
    updateRtcTouchCall,
    updateRtcTouchParams,
    updateRtcV3OnlineStatus,
    updateTtsOutSeqId,
    updateUserId,
    updateVoiceCall,
    updateVoiceCallId,
    updateVoiceCallShow,
    updateVoiceSpeaker,
} from './store/actions'
import reducers, { RootState } from './store/reducers'
import { ActionBackData, IIntelligenceChat, cargoCometStatusEnum } from './type'

/**
 • 智能聊天页面 ymm://flutter.dynamic/dynamic-page?biz=fta-di-main&page=pages-intelligence-chat-index&canchat=0&cargoid=*&chatrecordid=*
 • canchat 0 | 1：是否能聊天，0不能仅只读；1或未传则可以聊天
 • cargoid：货源id
 • chatrecordid：会话id
 • unread: 未读消息数
 • torecord: 0 | 1 返回时是否跳转到聊天记录页，1能，0或不传直接关闭当前页面
 • toCargoDetail: 0 | 1 返回时是否跳转货源详情
 */
const IntelligenceChat = (props: IIntelligenceChat) => {
    const context: any = useThreshContext()
    //从redux中获取数据
    //为避免type写在index.tsx中泰国拥挤，直接写在type文件里引入即可，
    //可以说使用了发布-订阅模式的思想
    const dispatch = useDispatch()
    const currentStore = useStore<RootState>()
    const {
        stopLoading,
        initData,
        hasNewMessage,
        userId,
        isPrivacyNumswitch,
        privacyNumUrl,
        smartChatConfigInfo,
        smartChatNotifyConfigInfo,
        voiceSpeakerToken,
        voiceSpeaker,
        showAILoading,
        isVoiceCall,
        isVoiceCallRtc,
        callStart,
        messageList,
        driverId,
        commentInfo,
        params,
        shipperId,
        voiceCallShow,
        ttsWaitList = [],
        ttsOutSeqId,
        showTelephoneBanner,
        showNoticeCardBanner,
        searchConfig,
        rtcTouchCall,
        requestId,
        rtcCode,
        unread,
        hitRtcVoicePictureSyncGray,
        rtcSdkParams,
        voiceCallId: voiceCallIdStore,
        voiceCallCommentInfo,
        driverDetailToCall,
        pluginVersionCode,
    } = useSelector((store: RootState) => store.pageData)
    const [openUserFeedback, setOpenUserFeedback] = useState(false)
    const [isFeedBackOpened, setIsFeedBackOpened] = useState(false)
    const [rtcType, setRtcType] = useState('')
    const onUserFeedbackClose = close_type => {
        setOpenUserFeedback(false)
        if (feedBackType == 'back') {
            requestBeforeOut()
            Bridge.call('app.ui.closeWindow', { context })
        }
    }
    const [chatEntryPromptVisible] = useState(false) // 聊天入口提示弹框是否显示
    const { cargoCardInfo, driverChatBox } = initData
    const [promptVisible, setPromptVisible] = useState(false) // 显示支付定金校验弹框
    const [promptText, setPromptText] = useState('')
    const [showMoreButton, hideMoreButton] = useModal()
    const moreButtonRef: any = useRef()
    const beginTime = useRef(Date.now())
    const [popShow, setPopShow] = useState(false)
    const [pressMove, setPressMove] = useState(false)
    // const [recordPower, setRecordPower] = useState(false) // 是否有麦克风权限
    // const isFirst = useRef(true) // 判断是否第一次申请权限
    const QuestionsListRef = useRef<any>()

    const [tooShort, setTooShort] = useState(false)
    const gotoSettingFlag = useRef(false)
    const callStartRef = useLatest(callStart)
    // const [voiceCallShow, setVoiceCallShow] = useState(false)
    const [voiceCallId, setVoiceCallId] = useState('')
    const [driverMessageCount, setDriverMessageCount] = useState(0)
    const startTime = Date.now()
    const [leavePropVisible, setLeavePropVisible] = useState(false)

    const [popUpWindowData, setPopUpWindowData] = useState<any>(null)
    const quitPopTime = useRef<any>()
    const groupName = searchConfig?.groupName
    const [shipperIn, setShipperIn] = useState('0')
    const isFirstCall = useRef(true)
    const [feedBackType, setFeedBackType] = useState('back')

    //临时使用，尽快下掉
    const [isUseV3, setIsUseV3] = useState(false)

    // 语音2.0动画
    //使用useRef来得到其的高度
    const voiceModalHeightValue = useRef(new Animated.Value(0)).current // 高度
    //设置动画效果来升起或者关闭弹窗
    const onAnimationRtc = useCallback(() => {
        voiceModalHeightValue.setValue(+pxTransform(0))
        //使用内部api控制其的生与降
        Animated.timing(context, voiceModalHeightValue, {
            // 这里heightValue关联了多个节点的height属性
            from: 0,
            to: +pxTransform(430),
            duration: 200,
        }).start(() => {
            //必须这样设置
            voiceModalHeightValue.setValue(+pxTransform(430))
        })
    }, [])
    //进行弹窗的关闭
    const onAnimationRtcReverse = useCallback(() => {
        //对其进行关闭
        voiceModalHeightValue.setValue(+pxTransform(430))
        Animated.timing(context, voiceModalHeightValue, {
            // 这里heightValue关联了多个节点的height属性
            from: +pxTransform(430),
            to: 0,
            duration: 300,
        }).start(() => {
            voiceModalHeightValue.setValue(+pxTransform(0))
        })
    }, [])
    //是否进行了电话接听，如果进行了电话接听直接将其滑到页面底部
    useEffect(() => {
        console.log('🚀====isVoiceCallRtc=', isVoiceCallRtc)
        if (isVoiceCallRtc) {
            onAnimationRtc()
            //提到的eventCenter机制
            eventCenter.dispatchEvent(EventName.intelligence_chat_message_scroll_to_end, context)
        }
    }, [isVoiceCallRtc])
    //关闭通话过程
    const onCallOffRtc = async () => {
        if (isUseV3) {
            return
        }
        //使用createInnerAudioContext来接受信息
        const audio = createInnerAudioContext()
        audio.autoplay = true
        audio.src =
            'https://imagecdn.ymm56.com/ymmfile/static/resource/ffc439af-747d-4deb-bc73-fcf84339e926.wav'
        audio?.play?.()
        // @ts-ignore
        //通过Taro设置关闭
        Taro.setKeepScreenOn({ keepScreenOn: false, context }).then((res: any) => {
            console.log('已设置为不常亮')
        })
        //tiga设置运满满内部rtc进行关闭
        Tiga.Media.RTC.leave(context).then(res => {
            if (res?.data?.type !== 'error') {
                console.log('🚀======leave', res)
            } else {
                trackErrorRtc(context, res?.data?.info?.type)
            }
        })
        //获得更新状态
        dispatch(updateVoiceCall({ isVoiceCallRtc: false }))
        dispatch(updateRtcTouchCall(false))
        dispatch(updateDriverDetailToCall(false))
        onAnimationRtcReverse()
        // dispatch(sendBroadCastTip('语音通话已结束', context, voiceCallId))
        openfeedBackCheck(voiceCallId)
        setVoiceCallId('')

        // 音画同步灰度，如果挂断需要同步最后一个seqId--即为会话id
        if (hitRtcVoicePictureSyncGray) {
            dispatch(
                getLatestOutSeqId(
                    {
                        cargoId: params.cargoId,
                        chatRecordId: params.chatRecordId,
                        orientation: 0,
                        outSeqId: 0,
                    },
                    context
                )
            )
        }
    }
    //包含各种各样的判断条件，例如；此反馈弹窗，包括了对于item的信息进行判断，如果其是>=5条那么就是升起反馈弹窗
    const openfeedBackCheck = callId => {
        const callMessageCount = messageList.filter(
            item =>
                item.fromUid == driverId &&
                item?.ext?.voiceCallId == callId &&
                item?.base?.chatType == 'chat'
        ).length
        if (
            callMessageCount >= (voiceCallCommentInfo?.msgCount || 5) &&
            commentInfo?.enableComment &&
            voiceCallCommentInfo?.driverCommentTagV2 &&
            !isFeedBackOpened
        ) {
            setIsFeedBackOpened(true)
            setFeedBackType('callOff')
            setOpenUserFeedback(true)
        }
    }
    //这个与后文相关，即更新司机的聊天数量
    useEffect(() => {
        const _driverMessageCount = messageList.filter(item => item.fromUid == driverId).length
        setDriverMessageCount(_driverMessageCount)
    }, [messageList.length, driverId])

    //rtc通话挽留弹窗
    const [showExitRtcPop, hideExitRtcPop] = useModal()
    const ExitPageConfirm = (urlOrFun, source: RtcOffModalSourceEnum) => {
        if (isVoiceCallRtc) {
            //使用函数的形式来引用弹窗，然后如果确认就进行关闭
            showExitRtcPop({
                content: '前往该页面将挂断电话，是否确认？',
                cancelText: '取消',
                confirmText: '确认并前往',
                onShow: () => rtcOffBlockModalRegionview(source),
                onConfirm: () => {
                    hideExitRtcPop()
                    onCallOffRtc()
                    setTimeout(() => {
                        if (typeof urlOrFun == 'string') {
                            schemeJump(urlOrFun, context)
                        } else {
                            urlOrFun()
                        }
                    }, 500)
                },
                onCancel: () => {

                    hideExitRtcPop()
                },
            })
        } else {
            if (typeof urlOrFun == 'string') {
                schemeJump(urlOrFun, context)
            } else {
                urlOrFun()
            }
        }
    }
    //需要这样显示正常
    useBeforePop(() => {
        return new Promise(resolve => {
            //判断机型
            if (Platform.OS === 'android') {
                back(() => {
                    resolve(false)
                })
                return
            }
            requestBeforeOut()
            resolve(false)
        })
    })

    /**
     • 退出页面接口
     */
        //使用Network通知网络其已经退出的操作
    const requestBeforeOut = async () => {
            try {
                if (!props.cargoid) return
                await Network.driverOut(
                    {
                        cargoId: props.cargoid,
                    },
                    context
                )
            } catch {}
        }

    /**
     • 点击确定关闭弹框调用
     */
    const requestOnConfirm = async type => {
        try {
            if (type === '3') {
                await Network.requestAiNoticeSetting(
                    {
                        code: 'driverCallOrSms',
                        status: 1,
                    },
                    context
                )
            }
        } catch {}
        if (type !== '4') {
            requestBeforeOut()
            Bridge.call('app.ui.closeWindow', { context })
        }
    }
    //获取其的信息
    useDidShow(() => {
        if (gotoSettingFlag.current) {
            fetchData()
            gotoSettingFlag.current = false
        }
        Bridge.call('app.storage.setItemByGroup', {
            text: String(props.cargoid),
            key: 'di_chat_shown_cargoid',
            context,
            group: 'di_storage',
        })
    })
    //卸载
    useDidHide(() => {
        Bridge.call('app.storage.setItemByGroup', {
            text: '',
            key: 'di_chat_shown_cargoid',
            context,
            group: 'di_storage',
        })
    })
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
    }, [params])
    //  页面初始化和清理的逻辑
    useEffect(() => {
        dispatch(updateMessageList([]))
        //保存构造参数到全局
        dispatch(updateConstructParams(props))
        // loading灰度
        console.log(props, 'props')
        // 获取配置
        dispatch(getLionConfig(String(props.cargoid), context))
        console.log(props, 'props')
        if (props?.additionalParam) {
            let additionalParam = JSON.parse(decodeURIComponent(props?.additionalParam ?? '{}'))
            dispatch(updateRequestId(additionalParam?.requestId || ''))
        }
        // 优化后逻辑
        if (props.fastOpen === '1') {
            // 判断是否展示loading
            if (props.isShowLoading && props.isShowLoading === '1') {
                dispatch(updateLoading(false)) // 展示
            } else {
                dispatch(updateLoading(true)) // 不展示
            }
            dispatch(updateFastOpen(props.fastOpen))
        }
        dispatch(updateVoiceSpeaker({ voiceSpeaker: Tiga.Media.getSpeaker() }))
        dispatch(updateNoread(Number(props.unread || 0)))
        dispatch(
            updateParams({
                cargoId: props.cargoid,
                chatRecordId:
                    props.chatrecordid && props.chatrecordid !== 'undefined' ? props.chatrecordid : null,
                viewType: props.canchat == '0' ? 'read' : '',
                toCall: props.toCall || '0',
            })
        )
        fetchData(startTime)
        // 请求历史消息记录
        dispatch(
            fetchMessageList(
                {
                    cargoId: props.cargoid,
                    chatRecordId:
                        props.chatrecordid && props.chatrecordid !== 'undefined' ? props.chatrecordid : null,
                    orientation: 0,
                    outSeqId: 0,
                },
                context,
                () => {
                    eventCenter.dispatchEvent(EventName.intelligence_chat_message_scroll_to_end)
                },
                Number(props?.unread || 0),
                startTime
            )
        )
        Bridge.call('user.getUserInfo', { context }).then(userInfo => {
            dispatch(updateUserId(userInfo?.data?.userId || ''))
        })
        Bridge.call('app.ui.addAbortPopInteractive', {
            rootViewTag: context.__pageSessionId__,
            context,
        }).catch(() => {})

        if (props.canchat == '0') {
        }
        dispatch(updateVoiceCall({ isVoiceCall: false }))
        // setVoiceCallShow(false)
        dispatch(updateVoiceCallShow(false))


        return () => {
            hangeUpBeforeLeave()
            Logger.warn('解除注册opType di_ai_send_driver_msg_event监听', context)
            // 取消注册长链
            Tiga.Message.removeLongConnListen({
                context: context,
                opType: OpType.DI_AI_SEND_DRIVER_MSG_EVENT,
                receiveMessageCallback: receiveMessageCallback,
                success(res) {
                    console.log('🚀====解除注册opType di_ai_send_driver_msg_event success结果: ', res)
                },
                fail(res) {
                    console.log('🚀==解除注册opType di_ai_send_driver_msg_event fail结果: ', res)
                },            })
            dispatch(clearState())
            Bridge.call('app.ui.removeAbortPopInteractive', {
                context,
            }).catch(() => {})

            if (props.canchat == '0') {
            }
            voiceSpeaker?.stop({ token: voiceSpeakerToken })
            dispatch(updateVoiceSpeaker({ voiceSpeaker: null }))
            dispatch(updateVoiceCall({ isVoiceCall: false }))
            // setVoiceCallShow(false)
            dispatch(updateVoiceCallShow(false))
        }
    }, [])

    /**
     • 退出页面兜底挂断
     */
    const hangeUpBeforeLeave = async () => {
        let RTCSwitch = await DiStorage.getItemByUserStorage({
            context,
            key: 'rtcV3Switch',
        })

        if (RTCSwitch !== SwitchStatueEnum.ON) {
            console.log('挂断调用')
            // 退出页面兜底挂断leave
            Tiga.Media.RTC.leave(context).then(res => {
                if (res?.data?.type !== 'error') {
                    //使用Tiga来关闭
                    console.log('🚀======leave', res)
                } else {
                    trackErrorRtc(context, res?.data?.info?.type)
                }
            })
        }
    }
    /*
     新字节tts播报
    更新智能客服的聊天功能
    */
    useEffect(() => {
        if (!ttsOutSeqId && ttsWaitList?.length >= 1) {
            dispatch(updateTtsOutSeqId(ttsWaitList[0]?.outSeqId))
        }
        console.log(ttsOutSeqId, ttsWaitList, '问题播报-播报')
    }, [ttsOutSeqId, ttsWaitList])

    useEffect(() => {
        eventCenter.addEventListener(`${context.__pageSessionId__}_sideInteractive`, back, {
            context,
        })
        return () => {
            eventCenter.removeEventListener(`${context.__pageSessionId__}_sideInteractive`, back, {
                context,
            })
        }
    }, [driverMessageCount, commentInfo?.enableComment])

    const receiveMessageRef = useRef<any>()
    /**
     • 处理长链消息
     • @param msgs
     注意：定义了 receiveMessageCallback，
     并且把真正的消息处理逻辑（receiveMessage）挂载到了一个 ref 上，
     从而做到始终拿到最新的函数引用，避免闭包问题。
     */
//     receiveMessage 是一个回调函数，用于接收消息并根据不同的业务逻辑处理它。主要操作包括：
// 解析消息内容（如果是字符串则转为 JSON）。
// 根据不同的 cargoCometStatus 执行相应操作：
// FINALHANGUP：示挂断消息并结束语音通话。
// GREETING：更新问候的 TTS URL。
// SHIPPER_IN：更新货主介入状态。
    const receiveMessage = useCallback(
        (msg: {
            /** 长链业务类型名 */
            opType: string
            /** 业务字段 */
            msgContent?: any
        }) => {
            Logger.warn('接受到长链' + JSON.stringify(msg), context)
            if (!msg?.msgContent) return
            let tempMsg = msg.msgContent
            if (typeof tempMsg === 'string') {
                try {
                    tempMsg = JSON.parse(tempMsg)
                } catch (e) {}
            }
            if (
                tempMsg?.cargoId == params.cargoId &&
                tempMsg?.cargoCometStatus === cargoCometStatusEnum.FINALHANGUP &&
                !!tempMsg.hangUpText
            ) {
                //接受长链 8：rtc异常接受 || 打断toast承接
                Taro.showToast({ title: tempMsg.hangUpText, context })
                onCallOffRtc()
            }
            if (
                tempMsg?.cargoId == params.cargoId &&
                tempMsg?.cargoCometStatus === cargoCometStatusEnum.GREETING &&
                tempMsg?.greetingTtsUrl
            ) {
                console.log(tempMsg?.greetingTtsUrl, 'tempMsg?.greetingTtsUrl')
                dispatch(updateGreetingTtsUrl(tempMsg?.greetingTtsUrl))
            }
            if (
                tempMsg?.cargoId == params.cargoId &&
                tempMsg?.cargoCometStatus === cargoCometStatusEnum.SHIPPER_IN
            ) {
                setShipperIn(tempMsg?.shipperIn || '0')
            }
        },
        [params]
    )

    useEffect(() => {
        receiveMessageRef.current = receiveMessage
    }, [receiveMessage])

    const receiveMessageCallback = useCallback(msg => {
        receiveMessageRef?.current?.(msg)
    }, [])

    /**
     • 获取页面初始化数据
     */
    const fetchData = (timeS?) => {
        dispatch(
            fetchPageData(
                {
                    cargoId: props.cargoid,
                    chatRecordId:
                        props.chatrecordid && props.chatrecordid !== 'undefined' ? props.chatrecordid : null,
                    viewType: props.canchat == '0' ? 'read' : '',
                    isRtcTouch: props?.isRtcTouch || '0',
                    priceIncrease: props?.priceIncrease || false,
                    toCall: props?.toCall || '0',
                },
                context,
                timeS
            )
        )
    }
    //在该生命周期中完成埋点
    useEffect(() => {
        if (stopLoading) {
            // 导航栏返回按钮曝光
            //埋点
        }
        if (promptVisible) {
            // 支付定金阻断弹框关闭按钮曝光
           //埋点
        } else if (promptText) {
            //埋点
        }
        if (isPrivacyNumswitch && !myApp.app.isDriver) {
            //埋点
        }

    }, [stopLoading, promptVisible, isPrivacyNumswitch])

    /**
     • 返回函数
     • @description 在返回时如果没有进行过入口提示则弹框提示，如果进行过则直接关闭页面
     判断是否需要显示评价弹框和挽留弹窗
     用户点击返回按钮时：
     调用 back 函数。
     back 函数：
     语音通话中：弹出确认框，询问是否挂断语音通话。用户确认后，调用 onCallOffRtc() 结束通话并执行 innerBack。
     没有语音通话：直接调用 innerBack 执行返回操作。
     innerBack 函数：
     如果需要，显示 评价弹框 或 挽留弹窗。
     根据角色判断：如果是货主，直接关闭窗口。如果是司机，根据 toCargoDetail 跳转到货源详情页或关闭窗口。
     */
    const innerBack = debounce(
        async callback => {
            try {
                //没有货源
                if (!props.cargoid) {
                    Bridge.call('app.ui.closeWindow', { context })
                    return
                }
                let reqData: ActionBackData = {
                    cargoId: props.cargoid,
                }

                //评价弹框漏出条件作为前置参数丢给后端，后端完成优先级判断
                if (
                    driverMessageCount >= (commentInfo?.msgCount ?? 3) &&
                    commentInfo?.enableComment &&
                    !isFeedBackOpened
                ) {
                    reqData.canTriggeredPopWindow = ['driverComment']
                }

                // 查询挽留弹窗
                //评价弹窗评级
                const res = await Network.quickPagePopSearch(reqData, context)

                if (res?.result == 1 && res?.data?.quitPopWindow?.[0]?.notifyMessage) {
                    setPopUpWindowData(res?.data?.quitPopWindow?.[0])
                    setLeavePropVisible(true)
                    return
                } else if (res?.result == 1 && res?.data?.quitPopWindow?.[0]?.code == 'driverComment') {
                    //评价弹框
                    setIsFeedBackOpened(true)
                    setFeedBackType('back')
                    setOpenUserFeedback(true)
                    return
                }

                const { data: appInfo } = await Bridge.call('app.base.appInfo', { context })
                if (appInfo?.appType === 'shipper') {
                    // 货主端直接关闭
                    dispatch(clearState())
                    Bridge.call('app.ui.closeWindow', { context })
                } else {
                    //driver端
                    dispatch(clearState())
                    requestBeforeOut()
                    if (props.toCargoDetail == '1') {
                        // 增加跳转货源详情页
                        if (cargoCardInfo?.oriCargoDetailUrl) {
                            Tiga.Navigator.navigate({
                                push: { url: cargoCardInfo?.oriCargoDetailUrl },
                                pop: { delta: 1 },
                                context: context,
                            })
                        }
                    } else {
                        Bridge.call('app.ui.closeWindow', { context })
                    }
                }
                callback?.()
            } catch (error) {
                //捕捉错误
                Logger.warn('app.storage.getItemByGroup调用失败' + error, context)
                Bridge.call('app.ui.closeWindow', { context })
            }
        },
        1000,
        {
            leading: true,
            trailing: false,
        }
    )
    //back 函数主要负责处理 返回操作的前置检查
    const back = callback => {
        if (isVoiceCallRtc) {
            showExitRtcPop({
                content: '前往该页面将挂断电话，是否确认？',
                cancelText: '取消',
                confirmText: '确认并前往',
                onShow: () => rtcOffBlockModalRegionview(RtcOffModalSourceEnum.Back),
                onConfirm: () => {
                    //确认关闭了
                    hideExitRtcPop()
                    onCallOffRtc()
                    setTimeout(() => {
                        innerBack(callback)
                    }, 500)
                },
                onCancel: () => {

                    hideExitRtcPop()
                },
            })
        } else {
            innerBack(callback)
        }
    }
    //请求麦克风权限 并且在获取权限后执行 语音通话的预检查。具体来说，
    // 这段代码主要涉及 语音输入权限的申请 和 根据权限检查进行语音通话的准备。
    const onOpenAiCallCallBack = () => {
        Tiga.Permission.requestPermission({
            context: context,
            permission: Tiga.Permission.Permissions.microphone,
            rationale:
                Taro.getSystemInfoSync().platform?.toLowerCase() === 'ios'
                    ? '麦克风权限已经关闭，为确保语音输入功能的正常使用，请您点击【去开启】，在设置页面开启麦克风权限'
                    : '麦克风权限已经关闭，为确保语音输入功能的正常使用，APP需申请麦克风权限',
            topHint: '',
        }).then(async res => {
            if (res.status === 1) {
                //
                let RTCSwitch = await DiStorage.getItemByUserStorage({
                    context,
                    key: 'rtcV3Switch',
                })
                const id =
                    RTCSwitch != 'on'
                        ? `v3_${props?.cargoid}${Date.now()}`
                        : `v4_${props?.cargoid}${Date.now()}`
                handleRtcPreCheck(id, 'chatAutoCall', true)
            }
        })
    }

    /**
     • 显示温馨提示弹框
     • @param text
     */
    const showPrompt = text => {
        setPromptText(text)
        setPromptVisible(true)
    }

    const handlePhoneClick = async () => {

        const { cargoid } = props
        //获取其的cargoId即可进行读取
        try {
            const res = await Network.requestVerifyCarogoValid({ cargoId: cargoid }, context)
            if (res.result !== 1) {
                Taro.showToast({ title: res?.errorMsg || '网络异常请稍后再试', context })
                return
            }
            const { toast } = res?.data
            if (toast) {
                Taro.showToast({ title: toast, context })
                return
            }
            if (!(await isAuthPrivateNum({ context }))) {
                showAuthModal({ context })
                return
            }
            openPrivateNumModal({
                context,
                privacyNumUrl: privacyNumUrl,
            })
        } catch (error) {}
    }
    //这段代码的作用是 显示更多按钮的下拉菜单（MoreBubble），并记录相应的用户交互行为。
    const showMoreIcon = useCallback(() => {
        //使用current来完成
        moreButtonRef?.current?.measure((x, y, width, height, pageX, pageY) => {
            showMoreButton({
                children: (
                    <MoreBubble
                        hide={hideMoreButton}
                        pos={{ pageX, pageY, height }}
                        renderContent={renderButton}
                    />
                ),
                overlayStyle: { backgroundColor: '#00000000' },
                closeOnClickOverlay: true,
                containerStyle: {
                    backgroundColor: '#00000000',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                },
            })
        })
    }, [moreButtonRef, smartChatConfigInfo, smartChatNotifyConfigInfo, isVoiceCallRtc])

    const getTrackPageName = () => {
        return myApp.app.isShipper ? 'AI_assistant_driver_list' : 'AI_assistant_chat_box'
    }
    //记录埋点数据
    const moreButtonItemOuterStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Taro.pxTransform(28),
        marginTop: Taro.pxTransform(23),
        marginBottom: Taro.pxTransform(23),
    }

    const renderButton = useCallback(() => {
        //实际上是一个下拉然后有多个协议，例如说多个字段啥的然后自己选择来进行展示
        return (
            <View className={styles.bubbleButtonView}>
                <View
                    style={moreButtonItemOuterStyle}
                    onClick={() => {
                        dispatch(updateHasNewMessage(false))
                        hideMoreButton()
                        if (props.torecord == '1') {
                            Tiga.Navigator.navigate({
                                push: { url: PageUrl.IntelligenceChatRecords },
                                pop: { delta: 1 },
                                context: context,
                            })
                        } else {
                            Bridge.call('app.ui.closeWindow', { context })
                        }
                    }}
                >
                    {hasNewMessage ? <View className={styles['red-dot']} /> : null}
                    <Image src={images.ai_record} className={styles.adivseFeedback} />
                    <Text className={styles['fta-custom-nav-bar-text']}>聊天列表</Text>
                </View>
                <View className={styles.gapLine} />
                <View
                    style={moreButtonItemOuterStyle}
                    onClick={() => {

                        ExitPageConfirm(
                            PageUrl.AdviceFeedback + '&cargoid=' + props.cargoid + '&userid=' + userId,
                            RtcOffModalSourceEnum.SettingIcon
                        )
                        hideMoreButton()
                    }}
                >
                    {/* @ts-ignore */}
                    <Image src={images.edit_black} className={styles.adivseFeedback} />
                    <Text className={styles['fta-custom-nav-bar-text']}>意见反馈</Text>
                </View>

                <View className={styles.gapLine} />
                <View
                    style={moreButtonItemOuterStyle}
                    onClick={() => {
                        ExitPageConfirm(PageUrl.ServiceAgreement, RtcOffModalSourceEnum.SettingIcon)
                        hideMoreButton()
                    }}
                >
                    <Image src={images.service_agreement} className={styles.adivseFeedback} />
                    <Text className={styles['fta-custom-nav-bar-text']}>服务协议</Text>
                </View>
                {smartChatConfigInfo?.smartVoiceDriverGray && myApp.app.isDriver ? (
                    <>
                        <View className={styles.gapLine} />
                        <View
                            style={moreButtonItemOuterStyle}
                            onClick={() => {

                                gotoSettingFlag.current = true
                                ExitPageConfirm(
                                    appendParamsToUrl(
                                        `ymm://flutter.dynamic/dynamic-page?biz=fta-di-main&page=messageSettingPage`,
                                        {
                                            ...(smartChatConfigInfo || {}),
                                            ...(smartChatNotifyConfigInfo || {}),
                                        }
                                    ),
                                    RtcOffModalSourceEnum.SettingIcon
                                )
                                hideMoreButton()
                            }}
                            onLayout={() => {
                                //埋点
                            }}
                        >
                            <Icon
                                value='SettingOutlined'
                                color='#1a1a1a'
                                size={36}
                                style={{ marginRight: pxTransform(16) }}
                            />
                            <Text className={styles['fta-custom-nav-bar-text']}>设置</Text>
                        </View>
                    </>
                ) : null}
            </View>
        )
    }, [smartChatConfigInfo, smartChatNotifyConfigInfo, isVoiceCallRtc])

    /**
     • rtc触达
     */
    useEffect(() => {
        const Id = `${props.cargoid}${Date.now()}`
        if (rtcTouchCall && isFirstCall.current) {
            isFirstCall.current = false
            Tiga.Permission.requestPermission({
                context: context,
                permission: Tiga.Permission.Permissions.microphone,
                rationale: inIOS
                    ? '麦克风权限已经关闭，为确保语音输入功能的正常使用，请您点击【去开启】，在设置页面开启麦克风权限'
                    : '麦克风权限已经关闭，为确保语音输入功能的正常使用，APP需申请麦克风权限',
                topHint: '',
            }).then(res => {
                if (res?.status == 1) {
                    handleRtcPreCheck(Id, props.rtcScene)
                } else {
                    //埋点
                }
            })
        }
    }, [rtcTouchCall])

    /**
     • 司机详情进入唤起rtc通话
     */
    //整理思路：是不是第一次语音接听，如果是，通过handleRtcPreCheck检查，不是，进行另一个useEffect进行openVoiceCal
    useEffect(() => {
        const Id = `${props.cargoid}${Date.now()}`
        if (driverDetailToCall && isFirstCall.current) {
            isFirstCall.current = false
            openVoiceCall(Id, 'activeCall')
        }
    }, [driverDetailToCall])

    const handleRtcPreCheck = async (voiceId, scene?, needGetRtcParam = false) => {
        let RTCSwitch = await DiStorage.getItemByUserStorage({
            context,
            key: 'rtcV3Switch',
        })

        let _scene = scene ? scene : 'rtcPush'

        if (RTCSwitch == 'on') {
            //如果开了直接接听
            openVoiceCall(voiceId, _scene)
        } else {
            //没有开，调用api来检测
            Network.rtcPreCheck(
                {
                    cargoId: props?.cargoid,
                    additionalParam: props?.additionalParam
                        ? decodeURIComponent(props?.additionalParam ?? '{}')
                        : null,
                    voiceCallId: voiceId,
                    rtcScene: _scene,
                },
                context
            ).then(res => {
                //获得其的token令牌
                if (res?.result == 1) {
                    if (res?.data?.success) {
                        if (res?.data?.tokenInfo) {
                            console.log(res?.data?.tokenInfo, 'res?.data?.tokenInfo')
                            dispatch(
                                updateRtcTouchParams({
                                    token: res?.data?.tokenInfo?.token,
                                    channelId: res?.data?.tokenInfo?.channelId,
                                    appId: res?.data?.tokenInfo?.appId,
                                    timeStamp: res?.data?.tokenInfo?.timeStamp,
                                })
                            )
                        } else if (props?.rtcParam) {
                            //获取其的通话路径
                            let propsParams = JSON.parse(decodeURIComponent(props?.rtcParam ?? '{}'))
                            dispatch(
                                updateRtcTouchParams({
                                    token: propsParams?.token,
                                    channelId: propsParams?.channelId,
                                    appId: propsParams?.appId,
                                    timeStamp: propsParams?.timeStamp,
                                })
                            )
                        }
                        //都获得以及更新完了，结束了
                        openVoiceCall(voiceId, _scene)
                        if (needGetRtcParam) {
                            dispatch(getRtcParams(onCallOffRtc, voiceId, context))
                        }
                    } else {
                        Taro.showToast({
                            icon: 'none',
                            title: res?.data?.failedMsg,
                            context: context,
                        })
                    }
                }
            })
        }
    }
    //跳转到v3的通话接口
    const jumpRtcVoiceCallV3 = (voiceId, rtcScene) => {
        const key = `rtcButtonTip_${params.cargoId}_${driverId}`
        // 已点击过电话按钮 -ForButtonTip
        Bridge.call('app.storage.setItem', {
            context,
            key,
            text: 1,
        })
        //获取其的参数
        let constructParam = currentStore.getState().pageData.constructParam
        let routertcParam = JSON.parse(decodeURIComponent(constructParam?.rtcParam ?? '{}'))

        let openChatParam = {
            apiConfig: {
                autoSlideWhenUserSpeak: 1,
            },
            chatParam: {
                cargoId: constructParam?.cargoid,
                rtcScene: rtcScene,
                voiceCallId: voiceId || '',
            },
        }
        if (routertcParam?.channelId) {
            openChatParam.apiConfig['tokenFromUri'] = routertcParam
        }
        if (constructParam?.additionalParam) {
            openChatParam.chatParam['additionalParam'] = decodeURIComponent(
                constructParam?.additionalParam
            )
        }
        const url = `ymm://di/voiceChat?openChatParam=${encodeURIComponent(
            JSON.stringify(openChatParam)
        )}`
        console.log('URL', url)
        schemeJump(url, context)
        dispatch(updateConstructParams({ ...constructParam, additionalParam: '', rtcParam: '{}' }))
    }

    // 开启语音通话
    const openVoiceCall = async (voiceId, rtcScene) => {
        setRtcType(rtcScene)
        console.log('UrlopenVoiceCall')
        //校验是否rtc通话中
        const isCallingRes = await Bridge.call('di.common.isPushBannerShowing', { context })
        if (isCallingRes?.data) {
            Taro.showToast({ title: '当前正在通话中', context })
            return
        }
        //得到开关
        //这里是简历里的通话记录存储库
        let RTCSwitch = await DiStorage.getItemByUserStorage({
            context,
            key: 'rtcV3Switch',
        })
        //得到id
        //实际上是检测条件罢了
        const Id =
            voiceId ||
            (RTCSwitch == 'on' ? `v4_${props.cargoid}${Date.now()}` : `v3_${props.cargoid}${Date.now()}`)
        setVoiceCallId(Id)
        dispatch(updateVoiceCallId(Id))
        // @ts-ignore
        Taro.setKeepScreenOn({ keepScreenOn: true, context }).then(() => {
            console.log('已设置为常亮')
        })
        //这里是前置操作，开启其的语音通过并且检测条件
        //顺利开启v3版本
        if (RTCSwitch == 'on') {
            setIsUseV3(true)
            jumpRtcVoiceCallV3(Id, rtcScene)
        } else {
            setIsUseV3(false)
            dispatch(updateVoiceCall({ isVoiceCallRtc: true }))
        }
    }

    useEffect(() => {
        if (!showAILoading && voiceSpeakerToken && isVoiceCall) {
            //埋点
        }
    }, [showAILoading, voiceSpeakerToken, isVoiceCall])

    useEffect(() => {
        //开启通话监听
        //通过rtcCallback来实时的监听语音通话的状态
        eventCenter.addEventListener(EventName.di_open_voice_call, onOpenAiCallCallBack, { context })
        eventCenter.addEventListener(EventName.event_bridge_di_business_callback, rtcCallBack, {
            context,
        })

        return () => {
            eventCenter.removeEventListener(EventName.di_open_voice_call, onOpenAiCallCallBack, {
                context,
            })
            eventCenter.removeEventListener(EventName.event_bridge_di_business_callback, rtcCallBack, {
                context,
            })
        }
    }, [])
    //监听
    //一个监听通话事件一个监听通话状态
    const rtcCallBack = res => {
        console.log('rtcCallBack', res?.type)
        if (res?.type === 'online') {
            dispatch(updateRtcV3OnlineStatus('on'))
        } else if (res?.type === 'offline' || res?.type === 'open_chat_failed') {
            dispatch(updatePhoneClickResponsed(false))
            dispatch(updateRtcV3OnlineStatus('off'))
        }
    }

    useDidShow(() => {
        //一个回调函数和一个rtcCallback都用这个，???
        Bridge.call('di.chat.getCurrentChatParam', { context }).then(res => {
            console.log('getCurrentChatParam', res)
            if (res?.data) {
                dispatch(updateRtcV3OnlineStatus('on'))
            } else {
                dispatch(updatePhoneClickResponsed(false))
                dispatch(updateRtcV3OnlineStatus('off'))
            }
        })
    })
    return (
        <PageLoadContainer
            headerComponent={
                <View style={{ backgroundColor: '#FFFFFF' }}>
                    <SafeArea top />
                    <TouchableOpacity
                        style={{ width: scale(100), height: scale(48) }}
                        onClick={() => {
                            Bridge.call('app.ui.closeWindow', { context })
                        }}
                    >
                        <Image
                            src={images.icon_back_page}
                            style={{ width: scale(48), height: scale(48), marginLeft: scale(32) }}
                        />
                    </TouchableOpacity>
                </View>
            }
            timeout={10000}
            stopLoading={stopLoading}
            refresh={fetchData}
            contentComponent={
                <View
                    className={styles['pageContainer']}
                    onClick={() => {
                        dispatch(updateFrequentlyQuestionListVisible(false))
                    }}
                >
                    <Image
                        src={images.orange_background_img}
                        style={{ position: 'absolute', top: 0, width: scale(720) }}
                        mode='widthFix'
                    />
                    <NavBar
                        safeAreaStyle={{ backgroundColor: 'transparent' }}
                        tintColor='transparent'
                        title={{
                            title: (
                                <View className={styles['title-container']}>
                                    <Text numberOfLines='1' className={styles['title-container-head']}>
                                        {groupName}
                                    </Text>
                                </View>
                            ),
                        }}
                        leftButton={
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    onClick={() => {
                                        back(() => {})
                                    }}
                                    style={{
                                        width: scale(48),
                                        height: scale(48),
                                        marginLeft: scale(32),
                                        marginRight: scale(1),
                                        border: '3px solid #1A1A1A',
                                    }}
                                    src={images.arrow_left}
                                />
                                {/* <NavbarAvatar /> */}
                            </View>
                        }
                        rightButton={
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                }}
                            >
                                {isPrivacyNumswitch && !myApp.app.isDriver ? (
                                    <View onClick={handlePhoneClick}>
                                        <Image className={styles.phoneIcon} src={images.black_phone_icon} />
                                    </View>
                                ) : (
                                    <></>
                                )}
                                <View
                                    onClick={() => {
                                        // const url =`ymm://rn.user/shippersimpleprofile?userid=${shipperId}&referPage=intelligenceChat`
                                        const url = `ymm://flutter.dynamic/dynamic-page?biz=thresh-fta-usercenter&page=pages-profile-shipper-simple-profile-index&userid=${shipperId}&referPage=intelligenceChat`
                                        ExitPageConfirm(url, RtcOffModalSourceEnum.ShipperIcon)
                                    }}
                                >
                                    <Image
                                        className={styles.phoneIcon}
                                        style={{ marginRight: scale(30) }}
                                        src={images.user_card}
                                    />
                                </View>
                                <View
                                    onClick={() => {
                                        ExitPageConfirm(showMoreIcon, RtcOffModalSourceEnum.SettingIcon)
                                    }}
                                    ref={moreButtonRef}
                                >
                                    <Image className={styles.phoneIcon} src={images.more_icon} />
                                </View>
                            </View>
                        }
                    />
                    {/* 货源详情卡片 */}
                    {/*<CargoDetailCard/>*/}
                    <CargoDetailCardNew
                        canchat={props.canchat}
                        ExitPageConfirm={ExitPageConfirm}
                        showPrompt={showPrompt}
                    />
                    {/* 聊天记录模块 */}
                    <ChatMessage
                        canchat={props.canchat}
                        showPrompt={showPrompt}
                        ExitPageConfirm={ExitPageConfirm}
                        onCallOffRtc={onCallOffRtc}
                        startTime={startTime}
                    />
                    {showTelephoneBanner && (!props.canchat || props.canchat == '1') && !voiceCallShow ? (
                        <TelephoneCardBanner canchat={props.canchat} ExitPageConfirm={ExitPageConfirm} />
                    ) : showNoticeCardBanner &&
                    (!props.canchat || props.canchat == '1') &&
                    !voiceCallShow &&
                    smartChatNotifyConfigInfo?.driverCallOrSms === SwitchStatueEnum.OFF ? (
                        <AiNoticeAuthCardBanner />
                    ) : null}
                    {/* 常见问题列表 */}
                    {!isVoiceCallRtc &&
                    (isUndefined(props.canchat) || isNull(props.canchat) || Number(props.canchat) === 1) ? (
                        <FrequentlyQuestionsList
                            canchat={props.canchat}
                            myref={QuestionsListRef}
                            openVoiceCall={openVoiceCall}
                            onCallOffRtc={onCallOffRtc}
                            sendMessageText={props?.sendMessageText}
                            voiceCallId={voiceCallId}
                            shipperIn={shipperIn}
                        />
                    ) : null}
                    {/* 语音2.0modal */}
                    <Animated.View
                        //@ts-ignore
                        className={styles.rtcContainer}
                        style={{ overflow: 'hidden', height: voiceModalHeightValue }}
                    >
                        <CallRtcModal
                            onCallOffRtc={onCallOffRtc}
                            voiceCallId={voiceCallId}
                            additionalParam={props?.additionalParam}
                            rtcType={rtcType}
                        />
                    </Animated.View>
                    <Modal
                        overflow // 支持顶部内容溢出
                        isOpened={promptVisible}
                        closable
                        title='温馨提示'
                        content={<RichText baseStyle={{ textAlign: 'center' }} nodes={promptText} />}
                        footer={
                            <ButtonGroup
                                style={{
                                    backgroundColor: 'transparent',
                                    justifyContent: 'center',
                                    marginBottom: scale(16),
                                    paddingLeft: scale(40),
                                    paddingRight: scale(40),
                                }}
                                list={[
                                    {
                                        text: '我知道了',
                                        onClick: () => {
                                            setPromptVisible(false)
                                        },
                                    },
                                ]}
                            />
                        }
                        prefix={
                            // 需要溢出的内容
                            <Flex.Center className={styles['tip-modal-on-closed']}>
                                <Image
                                    className={styles['tip-modal-on-closed__image']}
                                    // @ts-ignore
                                    src={images.robot_avatar_with_border}
                                />
                            </Flex.Center>
                        }
                        containerStyle={{
                            height: scale(399),
                        }}
                        background={
                            // 背景或元素记得设置绝对定位s
                            <Gradient
                                direction='toBottom'
                                startColor='#FFF0E6'
                                endColor='#FFF0E600'
                                style={{
                                    borderTopLeftRadius: scale(16),
                                    borderTopRightRadius: scale(16),
                                    height: scale(100),
                                    width: '100%',
                                    top: 0,
                                    position: 'absolute',
                                    zIndex: -1,
                                }}
                            />
                        }
                        onCancel={() => {
                            setPromptVisible(false)
                        }}
                        onClose={() => {
                            setPromptVisible(false)
                        }}
                    />

                    <ActionSheet
                        safeArea={false}
                        clickOverlayOnClose={false}
                        containerStyle={{ backgroundColor: 'transparent' }}
                        modalProps={{ avoidKeyboard: true, adjustableViewport: true }}
                        isOpened={openUserFeedback}
                    >
                        {feedBackType == 'back' ? (
                            <UserFeedback
                                onClose={onUserFeedbackClose}
                                commentChoice={commentInfo?.driverCommentChoice}
                                commentTitle={commentInfo?.driverCommentTitle}
                                cargoId={params?.cargoId}
                                hasOpened={openUserFeedback}
                                type='back'
                            />
                        ) : (
                            <UserFeedback
                                onClose={onUserFeedbackClose}
                                commentChoice={voiceCallCommentInfo?.driverCommentTagV2?.commentTags}
                                commentTitle={voiceCallCommentInfo?.driverCommentTagV2?.commentTitle}
                                cargoId={params?.cargoId}
                                hasOpened={openUserFeedback}
                                type='rtc'
                            />
                        )}
                    </ActionSheet>
                    <Modal
                        overflow
                        isOpened={leavePropVisible}
                        content={
                            <View className={styles['popTextStyle']}>{popUpWindowData?.notifyMessage || ''}</View>
                        }
                        onShow={() => {
                            quitPopTime.current = Date.now()
                        }}
                        onHide={() => {
                        }}
                        contentAlign='left'
                        footer={
                            <View style={{ width: '100%', height: scale(148) }}>
                                <BackDialogFooter
                                    buttonData={popUpWindowData}
                                    onLeftClick={() => {
                                        setLeavePropVisible(false)
                                        requestBeforeOut()
                                        Bridge.call('app.ui.closeWindow', { context })
                                    }}
                                    onRightClick={() => {
                                        setLeavePropVisible(false)
                                        requestOnConfirm(popUpWindowData.buttonList[1].type)
                                    }}
                                />
                            </View>
                        }
                        prefix={
                            <Flex.Center className={styles['tip-modal-on-closedNew']}>
                                <Image
                                    className={styles['tip-modal-on-closedNew__image']}
                                    src='https://imagecdn.ymm56.com/ymmfile/static/resource/f7926a3d-67b9-426e-a5f9-fbc33c2b358a.png'
                                />
                            </Flex.Center>
                        }
                        background={
                            <Gradient
                                direction='toBottom'
                                startColor='#FFF0E6ff'
                                endColor='#FFF0E600'
                                style={{
                                    borderTopLeftRadius: scale(16),
                                    borderTopRightRadius: scale(16),
                                    height: scale(100),
                                    width: '100%',
                                    top: 0,
                                    position: 'absolute',
                                    zIndex: -1,
                                }}
                            />
                        }
                    />
                </View>
            }
        />
    )
}

//在主页面中完成对于页面的初始化，以及语音通话的处理，以及各种离开弹窗，引入弹窗等复杂的分支判断。
//再花一点时间，总结公司项目：
