import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.englishchat',
  appName: 'AI English Chat',
  webDir: 'www',
  server: {
    url:'https://english-chat-mvp-android.vercel.app',
    cleartext: false,
  },
};

export default config;
