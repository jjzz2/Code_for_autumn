import HelloCard from '../hello-card'
import ImageCard from '../image-card'
import MiddleTip from '../middle-tip'
import NotesCard from '../notes-card'
import PayDepositCard from '../pay-deposit-card'

export const CardFactory = ({ message, position }) => {
    const { base, ext } = message;
    const tipRender = (message) => {
        return (
            <>
                {message.base.bidStateMsg ? (
                    <MiddleTip card={HelloCard} prefixText={message.base.bidStateMsg} />
                ) : null}
                {message.base.messageTip ? (
                    <MiddleTip card={PayDepositCard} prefixText={message.base.message} />
                ) : null}
            </>
        )
    }
    
}
export default CardFactory;