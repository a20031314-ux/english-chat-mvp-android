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
        String text = CapturedText.clean(intent.getStringExtra(CapturedText.EXTRA));
        String action = intent.getAction();
        if (text.isEmpty() && Intent.ACTION_PROCESS_TEXT.equals(action)) {
            CharSequence value = intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
            if (value != null) text = CapturedText.clean(value.toString());
        } else if (text.isEmpty() && Intent.ACTION_SEND.equals(action)) {
            text = CapturedText.clean(intent.getStringExtra(Intent.EXTRA_TEXT));
        }
        if (!text.isEmpty()) {
            WebReaderPlugin.deliverCapturedText(text);
        }
    }
}
