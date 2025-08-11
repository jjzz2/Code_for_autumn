import ChatAvatar from './ChatAvatar';
import { appInfo as myApp } from '@thresh/thresh-component'
import { PositionEnum } from '../../enum'
import { RootState } from '../../store/reducers'
const MessageItem = ({ message }) => {
    const { assistantId } = useSelector(() => RootState.pageData);
    //1.确定消息显示逻辑
    if (!message.imgShow && message.base.type === 'image') {
        return null;
    }
    const position = useMemo(() => {
        if ((myApp.app.isDriver && message.fromUid !== assistantId) ||
            (myApp.app.isShipper && message.fromUid === assistantId)) {
            return PositionEnum.LEFT;
        } else {
            return PositionEnum.RIGHT;
        }
    }, [message.fromUid, assistantId])
    return (
        <>
            {tipRender(message)}
            <View
                className={styles['chat-record-item']}
                style={{ flexDirection: position === PositionEnum.RIGHT ? 'row-reverse' : 'row' }}>
                <ChatAvatar
                    className={styles['chat-record-avatar']}
                    position={position}
                    message={message}>
                </ChatAvatar>
                {/* 2.信息提示 */}
                <MessageBubble message={message} position={position}></MessageBubble>
            </View>
        </>
    )
}