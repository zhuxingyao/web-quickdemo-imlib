import {
  init, connect, Events, getConversationList, ErrorCode, addEventListener,
  getHistoryMessages, sendMessage, IAsyncRes, IConversationOption, GetHistoryMessageOption,
  TextMessage, disconnect, destroy,
} from '@rongcloud/imlib-next';
import { 
  conversationList, historyMessages, hasMore, curConversation,
  updateMessageList, updateConversationList,
} from './context';

/**
 * 记录拉取离线消息是否完成
 */
let pullOffLineMessageFinished = false;

/**
 * 初始化
 * @param appkey 
 * @param navi 
 */
export const initIMLib = (appkey: string, navi: string, environment: string) => {
  init({
    appkey,
    navigators: navi ? navi.split(',') : undefined,
    environment: environment? environment : undefined,
  });

  // 监听 IMLib 事件
  addEventListener(Events.CONNECTING, () => {
    console.log('正在连接中');
  });
  addEventListener(Events.CONNECTED, () => {
    console.log('连接成功了');
  });
  addEventListener(Events.DISCONNECT, ( code: ErrorCode) => {
    console.log(`断开连接了 ${code}}`);
  });
  addEventListener(Events.SUSPEND, (code: ErrorCode) => {
    console.log(`异常断开, SDK 会自动重连, 异常原因：${code}}`);
  });
  addEventListener(Events.MESSAGES, (evt) => {
    // 忽略离线消息导致的 MESSAGES 事件
    if (!pullOffLineMessageFinished) return
    console.log(`收到新的消息`, evt);
    updateMessageList(evt.messages);
  });
  addEventListener(Events.CONVERSATION, (evt) => {
    // 忽略离线消息导致的 CONVERSATION 事件
    if (!pullOffLineMessageFinished) return
    console.log(`会话列表更新`, evt);
    const conversations = evt.conversationList.map((item) => item.conversation);
    updateConversationList(conversations);
  });
  addEventListener(Events.PULL_OFFLINE_MESSAGE_FINISHED, () => {
    console.log('离线消息拉取完成');
    pullOffLineMessageFinished = true;
    _getConversationList();
  });
};

/**
 * 连接 IM 服务
 * @param appkey
 * @param token
 * @param navi
 */
export const connectSocket = (appkey: string, token: string, navi: string, environment: string):Promise<IAsyncRes<{
  userId: string;
}>> => {
  return new Promise( async (resolve) => {
    initIMLib(appkey, navi, environment);
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
    console.log('获取会话列表成功');
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

/**
 * 发送消息
 */
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

export const _disConnect = async () => {
  await destroy()
}