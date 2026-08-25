package com.yourname.englishchat;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

/**
 * Shown in other apps' text-selection menu (Chrome, Reddit, etc.).
 * Forwards the selected string into MainActivity → the shared analysis sheet.
 */
public class ProcessTextActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String text = CapturedText.clean(readProcessText(getIntent()));
        if (!text.isEmpty()) {
            WebReaderPlugin.deliverCapturedText(text);
        }
        Intent launch = new Intent(this, MainActivity.class);
        launch.setAction(Intent.ACTION_MAIN);
        launch.addCategory(Intent.CATEGORY_LAUNCHER);
        launch.addFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_SINGLE_TOP
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
        );
        if (!text.isEmpty()) {
            launch.putExtra(CapturedText.EXTRA, text);
        }
        startActivity(launch);
        finish();
    }

    private static String readProcessText(Intent intent) {
        if (intent == null) return "";
        CharSequence value = intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
        return value == null ? "" : value.toString();
    }
}
