import { ref, nextTick } from 'vue';
import { IAReceivedConversation, IAReceivedMessage } from '@rongcloud/imlib-next';

export const scrollContainer = ref<HTMLDivElement>();
export const scrollContent = ref<HTMLDivElement>();

/** 当前登入成功的用户id */
export const curUserId = ref<string>('');
/** 渲染数据 - 会话列表 */
export const conversationList = ref<IAReceivedConversation[]>([]);
/** 渲染数据 - 历史消息数据 */
export const historyMessages = ref<IAReceivedMessage[]>([]);
/** 是否还有更多历史消息 */
export const hasMore = ref<boolean>(true);
/** 当前会话 */
export const curConversation = ref<IAReceivedConversation>();
/** 
 * 时间格式化 
 * 当天显示 时:分
 * 隔天显示 月:日
 * 隔年显示 年
 * */
export const timestampToDateTime = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  const currentDate = new Date();
  const targetDate = new Date(timestamp);

  const isSameYear = currentDate.getFullYear() === targetDate.getFullYear();
  const isSameDay = currentDate.toDateString() === targetDate.toDateString();

  if (isSameDay) {
    const hours = ("0" + targetDate.getHours()).slice(-2);
    const minutes = ("0" + targetDate.getMinutes()).slice(-2);
    return hours + ":" + minutes;
  } else if (isSameYear) {
    const month = ("0" + (targetDate.getMonth() + 1)).slice(-2);
    const day = ("0" + targetDate.getDate()).slice(-2);
    return month + "-" + day;
  } else {
    const year = targetDate.getFullYear();
    return year.toString();
  }
}
/** 更新历史消息 */
export const updateMessageList = async (messages: IAReceivedMessage[]) => {
  historyMessages.value.push(...messages);
  if (!scrollContainer.value || !scrollContent.value) return
  // 等待渲染完成
  await nextTick();
  scrollContainer.value.scrollTop = scrollContent.value.scrollHeight;
}
/** 更新会话列表 */
export const updateConversationList = (conversations: IAReceivedConversation[]) => {
  conversations.forEach((conversation) => {
    const index = conversationList.value.findIndex((item) => item.targetId === conversation.targetId && item.conversationType === conversation.conversationType);
    conversationList.value.splice(index, 1);
  })
  conversationList.value.unshift(...conversations);
}