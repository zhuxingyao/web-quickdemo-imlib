import {
  init, connect, Events, getConversationList, ErrorCode, addEventListener,
  getHistoryMessages, sendMessage, IAsyncRes, IConversationOption, GetHistoryMessageOption,
  TextMessage,
} from '@rongcloud/imlib-next';
import { 
  conversationList, historyMessages, hasMore, curConversation,
  updateMessageList,
} from './context';

/**
 * 初始化
 * @param appkey 
 * @param navi 
 */
export const initIMLib = (appkey: string, navi: string,) => {
  init({
    appkey,
    navigators: navi ? [navi] : undefined,
  });

  // 监听 IMLib 事件
  addEventListener(Events.CONNECTED, () => { });
  addEventListener(Events.DISCONNECT, () => { });
  addEventListener(Events.SUSPEND, () => { });
  addEventListener(Events.CONNECTING, () => { });
  addEventListener(Events.MESSAGES, (evt) => { });
  addEventListener(Events.PULL_OFFLINE_MESSAGE_FINISHED, () => {
    console.log('PULL_OFFLINE_MESSAGE_FINISHED');
    _getConversationList();
  });
};

/**
 * 连接 IM 服务
 * @param appkey
 * @param token
 * @param navi
 */
export const connectSocket = (appkey: string, token: string, navi: string):Promise<IAsyncRes<{
  userId: string;
}>> => {
  return new Promise( async (resolve) => {
    await initIMLib(appkey, navi);
    const { code, data } = await connect(token);
    resolve({ code, data });
  });
}; 

/**
 * 获取会话列表
 */
export const _getConversationList = async () => {
  const { code, data } = await getConversationList();
  if (code === ErrorCode.SUCCESS) {
    conversationList.value = data || [];
  }
}

/**
 * 获取历史消息
 */
export const _getHistoryMessages = async (conv: IConversationOption, option?: GetHistoryMessageOption) => {
  const { code, data } = await getHistoryMessages(conv, option);
  if (code === ErrorCode.SUCCESS) {
    historyMessages.value = data?.list || [];
    hasMore.value = data?.hasMore || false;
  }
}

export const _sendMessage = async (content: string) => {
  if (!curConversation.value) return;
  const message = new TextMessage({ content });
  const conversation = {
    targetId: curConversation.value.targetId,
    conversationType: curConversation.value.conversationType,
  };
  const { code, data } = await sendMessage(conversation, message);
  if (code === ErrorCode.SUCCESS) {
    console.log('发送消息成功');
    updateMessageList([data!]);
  }
}