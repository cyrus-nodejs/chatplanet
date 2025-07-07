import { convertTimestampToTime, capitalizeFirstLetter } from '../../../../utils/helper';
import { CHATMESSAGES } from '../../../../utils/types';


const ChatBubble = ({
  msg,
  isSender,
  senderName,
}: {
  msg: CHATMESSAGES;
  isSender: boolean;
  senderName: string | undefined;
}) => (
  
  <div
    key={msg?.sender_id}
    className={`max-w-xs p-3 rounded-lg ${
      isSender
        ? 'ml-auto bg-slateBlue text-white rounded-br-none bubble-user'
        : 'mr-auto bg-gray-300  text-gray-800 dark:bg- rounded-bl-none bubble-bot'
    }`}
  >
    <p>{msg.message}</p>
    <p>
      <span className="text-xs font-light">
        <i className="bx bx-time"></i> {convertTimestampToTime(msg.timestamp)}
      </span>
    </p>
    <p>{capitalizeFirstLetter(senderName)}</p>
  </div>
  
);


export default ChatBubble;