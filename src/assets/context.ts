import { ref } from 'vue';
import type { IAReceivedConversation, IAReceivedMessage } from '@rongcloud/imlib-next'

export const curUserId = ref<string>('');
export const conversationList = ref<IAReceivedConversation[]>([]);
export const historyMessages = ref<IAReceivedMessage[]>([]);
export const hasMore = ref<boolean>(true);
export const curConversation = ref<IAReceivedConversation>();
export const timestampToDateTime = (timestamp: number | undefined) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  // const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);

  const dateTime = month + "-" + day + " " + hours + ":" + minutes;
  return dateTime;
}

export const updateMessageList = (messages: IAReceivedMessage[]) => {
  historyMessages.value.push(...messages);
}