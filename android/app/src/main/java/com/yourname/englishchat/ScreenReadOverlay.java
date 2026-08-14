package com.yourname.englishchat;

import android.content.Context;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import java.util.ArrayList;
import java.util.List;

final class ScreenReadOverlay {
    interface Listener {
        void onPickRequested();
        void onStopRequested();
        void onAnalyzeRequested(ScreenReadBox box);
        void onAnalysisClosed();
    }

    private final Context context;
    private final WindowManager windowManager;
    private final Listener listener;
    private final String analyzeLabel;
    private final List<ScreenReadBox> latest = new ArrayList<>();

    private View bubbleView;
    private FrameLayout pickView;
    private LinearLayout panelView;
    private boolean pickOpen;
    private boolean panelOpen;

    ScreenReadOverlay(Context context, String analyzeLabel, Listener listener) {
        this.context = context.getApplicationContext();
        this.windowManager = (WindowManager) this.context.getSystemService(Context.WINDOW_SERVICE);
        this.analyzeLabel = analyzeLabel;
        this.listener = listener;
    }

    boolean isPickOpen() {
        return pickOpen;
    }

    boolean isPanelOpen() {
        return panelOpen;
    }

    void setBoxes(List<ScreenReadBox> boxes) {
        latest.clear();
        latest.addAll(boxes);
        if (pickOpen && !panelOpen) renderBoxes();
    }

    void show() {
        if (bubbleView != null) return;
        TextView bubble = new TextView(context);
        bubble.setText(analyzeLabel);
        bubble.setTextColor(Color.WHITE);
        bubble.setTypeface(Typeface.DEFAULT_BOLD);
        bubble.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        bubble.setPadding(dp(16), dp(12), dp(16), dp(12));
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.parseColor("#0F172A"));
        bg.setCornerRadius(dp(24));
        bubble.setBackground(bg);
        bubble.setOnClickListener(v -> listener.onPickRequested());
        bubble.setOnLongClickListener(v -> {
            listener.onStopRequested();
            return true;
        });
        WindowManager.LayoutParams params = baseParams();
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.gravity = Gravity.BOTTOM | Gravity.END;
        params.x = dp(16);
        params.y = dp(28);
        params.flags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        bubbleView = bubble;
        windowManager.addView(bubbleView, params);
    }

    void openPick() {
        if (pickOpen) return;
        pickOpen = true;
        pickView = new FrameLayout(context);
        pickView.setBackgroundColor(Color.parseColor("#66000000"));
        pickView.setOnClickListener(v -> closePick());
        WindowManager.LayoutParams params = baseParams();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        params.height = WindowManager.LayoutParams.MATCH_PARENT;
        params.gravity = Gravity.TOP | Gravity.START;
        windowManager.addView(pickView, params);
        renderBoxes();
    }

    void closePick() {
        pickOpen = false;
        if (pickView != null) {
            try {
                windowManager.removeView(pickView);
            } catch (Exception ignored) {}
            pickView = null;
        }
    }

    void showLoading(String selected) {
        panelOpen = true;
        closePick();
        ensurePanel();
        fillPanel(selected, context.getString(R.string.screen_read_loading), true);
    }

    void showResult(String title, String body) {
        panelOpen = true;
        ensurePanel();
        fillPanel(title, body, false);
    }

    void showError() {
        panelOpen = true;
        ensurePanel();
        fillPanel(
            analyzeLabel,
            context.getString(R.string.screen_read_failed),
            false
        );
    }

    void destroy() {
        closePick();
        closePanel();
        if (bubbleView != null) {
            try {
                windowManager.removeView(bubbleView);
            } catch (Exception ignored) {}
            bubbleView = null;
        }
    }

    private void renderBoxes() {
        if (pickView == null) return;
        pickView.removeAllViews();
        int shown = 0;
        for (ScreenReadBox box : latest) {
            if (shown >= 40) break;
            TextView hit = new TextView(context);
            hit.setText(box.text);
            hit.setTextColor(Color.parseColor("#0F172A"));
            hit.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
            hit.setPadding(dp(4), dp(2), dp(4), dp(2));
            hit.setBackgroundColor(Color.parseColor("#CCFEF3C7"));
            FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
                Math.max(dp(28), box.right - box.left),
                Math.max(dp(22), box.bottom - box.top)
            );
            lp.leftMargin = Math.max(0, box.left);
            lp.topMargin = Math.max(0, box.top);
            hit.setOnClickListener(v -> listener.onAnalyzeRequested(box));
            pickView.addView(hit, lp);
            shown += 1;
        }
    }

    private void ensurePanel() {
        if (panelView != null) return;
        panelView = new LinearLayout(context);
        panelView.setOrientation(LinearLayout.VERTICAL);
        panelView.setBackgroundColor(Color.WHITE);
        panelView.setPadding(dp(16), dp(12), dp(16), dp(20));
        WindowManager.LayoutParams params = baseParams();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.gravity = Gravity.BOTTOM;
        params.flags &= ~WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        windowManager.addView(panelView, params);
    }

    private void fillPanel(String title, String body, boolean loading) {
        if (panelView == null) return;
        panelView.removeAllViews();
        LinearLayout header = new LinearLayout(context);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setGravity(Gravity.CENTER_VERTICAL);
        TextView heading = new TextView(context);
        heading.setText(title);
        heading.setTextColor(Color.parseColor("#0F172A"));
        heading.setTypeface(Typeface.DEFAULT_BOLD);
        heading.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        LinearLayout.LayoutParams headingLp = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);
        header.addView(heading, headingLp);
        TextView close = new TextView(context);
        close.setText("✕");
        close.setTextColor(Color.parseColor("#64748B"));
        close.setPadding(dp(8), dp(8), dp(8), dp(8));
        close.setOnClickListener(v -> {
            closePanel();
            listener.onAnalysisClosed();
        });
        header.addView(close);
        panelView.addView(header);
        if (loading) {
            ProgressBar bar = new ProgressBar(context);
            bar.setPadding(0, dp(16), 0, dp(8));
            panelView.addView(bar);
        }
        ScrollView scroll = new ScrollView(context);
        TextView content = new TextView(context);
        content.setText(body);
        content.setTextColor(Color.parseColor("#334155"));
        content.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        content.setLineSpacing(dp(3), 1f);
        content.setPadding(0, dp(10), 0, dp(8));
        scroll.addView(content);
        LinearLayout.LayoutParams scrollLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            dp(280)
        );
        panelView.addView(scroll, scrollLp);
    }

    private void closePanel() {
        panelOpen = false;
        if (panelView != null) {
            try {
                windowManager.removeView(panelView);
            } catch (Exception ignored) {}
            panelView = null;
        }
    }

    private WindowManager.LayoutParams baseParams() {
        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        );
        return params;
    }

    private int dp(int value) {
        return Math.round(value * context.getResources().getDisplayMetrics().density);
    }
}
