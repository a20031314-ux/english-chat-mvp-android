package com.yourname.englishchat;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

/**
 * Shown in other apps' text-selection menu (Chrome, Reddit, etc.).
 * Forwards the selected English into this app's analysis flow.
 */
public class ProcessTextActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        CharSequence value = getIntent().getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
        if (value != null) {
            WebReaderPlugin.deliverCapturedText(value.toString());
        }
        Intent launch = new Intent(this, MainActivity.class);
        launch.addFlags(
            Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                | Intent.FLAG_ACTIVITY_SINGLE_TOP
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
        );
        startActivity(launch);
        finish();
    }
}
