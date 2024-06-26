<script setup lang="ts">
import { ref } from 'vue';
import { ErrorCode } from '@rongcloud/imlib-next';
import { connectSocket } from '../assets/im';
import { curUserId } from '../assets/context';

const appkey = ref<string>('');
const token = ref<string>('');
const navigators = ref<string>('');
const environment = ref<string>('');


const connect = async () => {
  const { code, data } = await connectSocket(appkey.value, token.value, navigators.value);
  if (code === ErrorCode.SUCCESS) {
    curUserId.value = data!.userId;
  }
}
</script>
<template>
<div class="rong-login">
  <div class="rong-login-form">
      <h3 class="rong-login-form-title">
        Web Quick Demo ImLib
      </h3>
      <div class="rong-login-form-input">
        <input type="text" placeholder="请输入 appkey (必填)" v-model="appkey">
      </div>
      <div class="rong-login-form-input">
        <input type="text" placeholder="请输入 token (必填)" v-model="token">
      </div>
      <div class="rong-login-form-input">
        <input type="text" placeholder="请输入 navigators (多个地址用','隔开)" v-model="navigators">
      </div>
      <div class="rong-login-form-input">
        <input type="text" placeholder="请输入 environment (选填)" v-model="environment">
      </div>
      <div class="rong-login-form-footer">
        <button @click="connect">连接</button>
        <div style="padding: 5px 0;">
          environment 不填默认是 default 表示外网
        </div>
      </div>
  </div>
</div>
</template>
<style scoped>
.rong-login{
  padding: 50px 100px;
  border: 1px solid #fff;
  border-radius: 5px;
  box-shadow: inset 0 0 8px rgba(253, 253, 253, 0.5);
}
.rong-login-form {
  display: flex;
  flex-direction: column;;
}
.rong-login-form-input {
  margin-bottom: 10px;
}
.rong-login-form-input input {
  width: 100%;;
  height: 32px;
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 0 10px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}
</style>