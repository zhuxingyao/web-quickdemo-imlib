<script setup lang="ts">
import { ref } from 'vue';
import { IAReceivedConversation, MessageDirection } from '@rongcloud/imlib-next';
import { conversationList, timestampToDateTime, curConversation, historyMessages } from '../assets/context';
import { _getHistoryMessages, _sendMessage } from '../assets/im';
import { curUserId } from '../assets/context';

const message = ref<string>('');
const scrollContainer = ref<HTMLDivElement>();
const scrollContent = ref<HTMLDivElement>();


const handleConversationChange = async (item:IAReceivedConversation) => {
  const { targetId, conversationType, channelId } = item;
  curConversation.value = item;
  await _getHistoryMessages(
    { targetId, conversationType, channelId },
    { count: 20 , timestamp: 0, order: 0 },
  );
  if (!scrollContainer.value || !scrollContent.value) return
  scrollContainer.value.scrollTop = scrollContent.value.scrollHeight;
}

const handleSendMessage = async() => {
  if (!scrollContainer.value || !scrollContent.value) return
  await _sendMessage(message.value);
  message.value = '';
  scrollContainer.value.scrollTop = scrollContent.value.scrollHeight;
}


</script>
<template>
  <div class="rong-chat">
    <div class="rong-chat-box">
      <div class="rong-chat-left">
        <div class="rong-chat-conversation"
          v-for="item in conversationList" :key="`${item.targetId}&${item.conversationType}`"
          @click="handleConversationChange(item)" 
          >
          <div class="rong-chat-conversation-title">{{ item.targetId }}</div>
          <div class="rong-chat-conversation-content">
            <span class="message">{{ item.latestMessage?.content.content }}</span>
            <span class="time">{{ timestampToDateTime(item.latestMessage?.sentTime) }}</span>
          </div>
        </div>
      </div>
      <div v-if="curConversation" class="rong-chat-right">
        <div class="rong-chat-name">
          {{ curConversation.targetId }}
        </div>
        <div class="rong-chat-messages" ref="scrollContainer">
          <div ref="scrollContent">
            <div class="rong-chat-message" 
              v-for="item in historyMessages" :key="item.messageUId"
              :class="{
                'is-self': item.senderUserId === curUserId && item.messageDirection === MessageDirection.SEND,
              }"
              >
              <div class="rong-author">
                {{ item.senderUserId !== curUserId ? item.targetId : item.senderUserId }}
              </div>
              <div class="rong-chat-message-content">
                {{ item.content.content }}
              </div>
            </div>
          </div>
        </div>
        <div class="rong-chat-editor">
          <div class="rong-chat-editor-extra">
            <button @click="handleSendMessage">发送</button>
          </div>
          <div class="rong-chat-editor-input">
            <textarea placeholder="请输入消息" v-model="message"></textarea>
          </div>
        </div>
      </div>
      <div v-else class="rong-chat-right"></div>
    </div>
  </div>
</template>
<style scoped>
.rong-chat {
  display: flex;
  width: 60%;
  height: 100%;
  padding: 100px 0;
  box-sizing: border-box;
}
.rong-chat-box {
  display: flex;
  border: 1px solid #fff;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 8px rgba(253, 253, 253, 0.5);
  overflow: hidden;
}
.rong-chat-left {
  width: 20%;
  border-right: 1px solid #fff;
  height: 100%;
  overflow-y: auto;
}
.rong-chat-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.rong-chat-conversation {
  padding: 5px 20px;
  cursor: pointer;
}
.rong-chat-conversation:hover {
  background-color: #b4b3b3;
}
.rong-chat-conversation .rong-chat-conversation-title {
  font-size: 16px;
  font-weight: bold;
}
.rong-chat-conversation-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rong-chat-conversation-content .message {
  width: 60%;
  overflow: hidden;
  font-size: 12px;
}
.rong-chat-conversation-content .time {
  font-size: 12px;
}

.rong-chat-name {
  font-size: 20px;
  font-weight: bold;
  padding: 10px 20px;
  border-bottom: 1px solid #fff;
}
.rong-chat-messages {
  height: 60%;
  border-bottom: 1px solid #fff;
  padding: 10px 20px;
  overflow-y: auto;
}
.rong-chat-message {
  display: flex;
  align-items: center;
}
.rong-author {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #fff;
  color: #333;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rong-chat-message-content {
  background-color: #fff;
  color: #333;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
  word-break: break-all;
}
.is-self {
  flex-direction: row-reverse;
}
.is-self .rong-chat-message-content {
  background-color: #b4b3b3;
  color: #fff;
}
.rong-chat-editor {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.rong-chat-editor-extra {
  padding: 5px;
  display: flex;
  justify-content: flex-end;
}

.rong-chat-editor-input {
  flex: 1;
  height: 100%;
}
textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  background-color: #333;
  color: #fff;
}
</style>