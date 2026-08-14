package com.yourname.englishchat;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WebReaderPlugin.class);
        super.onCreate(savedInstanceState);
        handleCapturedText(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleCapturedText(intent);
    }

    private void handleCapturedText(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String text = null;
        if (Intent.ACTION_PROCESS_TEXT.equals(action)) {
            CharSequence value = intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
            if (value != null) text = value.toString();
        } else if (Intent.ACTION_SEND.equals(action)) {
            text = intent.getStringExtra(Intent.EXTRA_TEXT);
        }
        if (text != null) {
            WebReaderPlugin.deliverCapturedText(text);
        }
    }
}
