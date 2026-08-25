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
        void onOpenInApp(String sentence);
        void onAnalysisClosed();
    }

    private final Context context;
    private final WindowManager windowManager;
    private final Listener listener;
    private final String analyzeLabel;
    private final List<ScreenReadBox> latest = new ArrayList<>();
    private final List<View> hitViews = new ArrayList<>();

    private View bubbleView;
    private WindowManager.LayoutParams bubbleParams;
    private LinearLayout barView;
    private LinearLayout panelView;
    private TextView panelTitle;
    private TextView panelBody;
    private ProgressBar panelProgress;
    private TextView panelOpenInApp;
    private boolean pickOpen;
    private boolean panelOpen;
    private boolean scanFinishedEmpty;
    private String lastSignature = "";
    private String currentSentence = "";

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

    boolean hasBoxes() {
        return !latest.isEmpty();
    }

    void setBoxes(List<ScreenReadBox> boxes) {
        String signature = signature(boxes);
        boolean same = signature.equals(lastSignature);
        latest.clear();
        latest.addAll(boxes);
        if (!boxes.isEmpty()) scanFinishedEmpty = false;
        if (!pickOpen || panelOpen) return;
        if (same) return;
        lastSignature = signature;
        renderBar();
        renderHits();
    }

    void setScanFinishedEmpty() {
        if (!latest.isEmpty()) return;
        scanFinishedEmpty = true;
        if (pickOpen && !panelOpen) renderBar();
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
        bubble.setOnClickListener(v -> {
            if (panelOpen) closePanel();
            else if (pickOpen) closePick();
            else listener.onPickRequested();
        });
        bubble.setOnLongClickListener(v -> {
            listener.onStopRequested();
            return true;
        });
        bubbleParams = baseParams();
        bubbleParams.width = WindowManager.LayoutParams.WRAP_CONTENT;
        bubbleParams.height = WindowManager.LayoutParams.WRAP_CONTENT;
        bubbleParams.gravity = Gravity.BOTTOM | Gravity.END;
        bubbleParams.x = dp(16);
        bubbleParams.y = dp(28);
        bubbleParams.flags |= WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        bubbleView = bubble;
        windowManager.addView(bubbleView, bubbleParams);
    }

    void openPick() {
        if (pickOpen) return;
        pickOpen = true;
        scanFinishedEmpty = false;
        lastSignature = "";
        ensureBar();
        renderBar();
        renderHits();
        restackBubble();
    }

    void closePick() {
        pickOpen = false;
        scanFinishedEmpty = false;
        lastSignature = "";
        closePanel();
        clearHits();
        if (barView != null) {
            try {
                windowManager.removeView(barView);
            } catch (Exception ignored) {}
            barView = null;
        }
    }

    void showAnalysisLoading(String sentence) {
        currentSentence = sentence == null ? "" : sentence;
        ensurePanel();
        panelOpen = true;
        clearHits();
        if (barView != null) barView.setVisibility(View.GONE);
        panelTitle.setText(currentSentence);
        panelBody.setText(context.getString(R.string.screen_read_loading));
        panelProgress.setVisibility(View.VISIBLE);
        panelOpenInApp.setVisibility(View.GONE);
        restackBubble();
    }

    void showAnalysisResult(String title, String body) {
        ensurePanel();
        panelOpen = true;
        if (title != null && !title.trim().isEmpty()) panelTitle.setText(title.trim());
        panelBody.setText(body == null ? "" : body);
        panelProgress.setVisibility(View.GONE);
        panelOpenInApp.setVisibility(View.VISIBLE);
        restackBubble();
    }

    void showAnalysisError() {
        ensurePanel();
        panelOpen = true;
        panelBody.setText(context.getString(R.string.screen_read_failed));
        panelProgress.setVisibility(View.GONE);
        panelOpenInApp.setVisibility(currentSentence.isEmpty() ? View.GONE : View.VISIBLE);
        restackBubble();
    }

    void destroy() {
        closePick();
        if (bubbleView != null) {
            try {
                windowManager.removeView(bubbleView);
            } catch (Exception ignored) {}
            bubbleView = null;
        }
    }

    private void closePanel() {
        boolean wasOpen = panelOpen;
        panelOpen = false;
        currentSentence = "";
        if (panelView != null) {
            try {
                windowManager.removeView(panelView);
            } catch (Exception ignored) {}
            panelView = null;
            panelTitle = null;
            panelBody = null;
            panelProgress = null;
            panelOpenInApp = null;
        }
        if (barView != null) barView.setVisibility(View.VISIBLE);
        if (pickOpen) {
            lastSignature = "";
            renderBar();
            renderHits();
        }
        if (wasOpen) listener.onAnalysisClosed();
    }

    private void ensureBar() {
        if (barView != null) return;
        barView = new LinearLayout(context);
        barView.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.parseColor("#F8FAFC"));
        bg.setCornerRadii(new float[] {
            dp(16), dp(16), dp(16), dp(16), 0, 0, 0, 0
        });
        barView.setBackground(bg);
        barView.setPadding(dp(12), dp(10), dp(12), dp(14));
        WindowManager.LayoutParams params = baseParams();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.gravity = Gravity.BOTTOM;
        params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
        params.y = 0;
        windowManager.addView(barView, params);
    }

    private void renderBar() {
        if (barView == null) return;
        barView.removeAllViews();
        TextView heading = new TextView(context);
        heading.setText(
            context.getString(
                latest.isEmpty()
                    ? (scanFinishedEmpty
                        ? R.string.screen_read_none
                        : R.string.screen_read_finding)
                    : R.string.screen_read_pick
            )
        );
        heading.setTextColor(Color.parseColor("#0F172A"));
        heading.setTypeface(Typeface.DEFAULT_BOLD);
        heading.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        heading.setPadding(0, 0, 0, latest.isEmpty() ? 0 : dp(8));
        barView.addView(heading);

        if (latest.isEmpty()) return;

        ScrollView scroll = new ScrollView(context);
        LinearLayout list = new LinearLayout(context);
        list.setOrientation(LinearLayout.VERTICAL);
        int shown = 0;
        for (ScreenReadBox box : latest) {
            if (shown >= 8) break;
            TextView row = new TextView(context);
            row.setText(box.text);
            row.setTextColor(Color.parseColor("#1E293B"));
            row.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            row.setMaxLines(2);
            row.setPadding(dp(10), dp(8), dp(10), dp(8));
            GradientDrawable rowBg = new GradientDrawable();
            rowBg.setColor(Color.WHITE);
            rowBg.setCornerRadius(dp(10));
            rowBg.setStroke(dp(1), Color.parseColor("#E2E8F0"));
            row.setBackground(rowBg);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            );
            lp.bottomMargin = dp(6);
            ScreenReadBox target = box;
            row.setOnClickListener(v -> listener.onAnalyzeRequested(target));
            list.addView(row, lp);
            shown += 1;
        }
        scroll.addView(list);
        LinearLayout.LayoutParams scrollLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            dp(120)
        );
        barView.addView(scroll, scrollLp);
    }

    private void ensurePanel() {
        if (panelView != null) return;
        panelView = new LinearLayout(context);
        panelView.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.parseColor("#FFFDF8"));
        bg.setCornerRadii(new float[] {
            dp(18), dp(18), dp(18), dp(18), 0, 0, 0, 0
        });
        bg.setStroke(dp(1), Color.parseColor("#FDE68A"));
        panelView.setBackground(bg);
        panelView.setPadding(dp(16), dp(14), dp(16), dp(18));

        LinearLayout header = new LinearLayout(context);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setGravity(Gravity.CENTER_VERTICAL);

        panelTitle = new TextView(context);
        panelTitle.setTextColor(Color.parseColor("#0F172A"));
        panelTitle.setTypeface(Typeface.DEFAULT_BOLD);
        panelTitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        panelTitle.setMaxLines(4);
        LinearLayout.LayoutParams titleLp = new LinearLayout.LayoutParams(
            0,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1f
        );
        header.addView(panelTitle, titleLp);

        TextView close = new TextView(context);
        close.setText(context.getString(R.string.screen_read_close));
        close.setTextColor(Color.parseColor("#64748B"));
        close.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        close.setPadding(dp(10), dp(6), 0, dp(6));
        close.setOnClickListener(v -> closePanel());
        header.addView(close);
        panelView.addView(header);

        panelProgress = new ProgressBar(context);
        LinearLayout.LayoutParams progressLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        progressLp.gravity = Gravity.CENTER_HORIZONTAL;
        progressLp.topMargin = dp(12);
        progressLp.bottomMargin = dp(8);
        panelView.addView(panelProgress, progressLp);

        ScrollView scroll = new ScrollView(context);
        panelBody = new TextView(context);
        panelBody.setTextColor(Color.parseColor("#334155"));
        panelBody.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        panelBody.setLineSpacing(dp(4), 1f);
        panelBody.setPadding(0, dp(10), 0, dp(8));
        scroll.addView(panelBody);
        LinearLayout.LayoutParams scrollLp = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            dp(280)
        );
        panelView.addView(scroll, scrollLp);

        panelOpenInApp = new TextView(context);
        panelOpenInApp.setText(context.getString(R.string.screen_read_open_in_app));
        panelOpenInApp.setTextColor(Color.parseColor("#1D4ED8"));
        panelOpenInApp.setTypeface(Typeface.DEFAULT_BOLD);
        panelOpenInApp.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        panelOpenInApp.setPadding(0, dp(8), 0, 0);
        panelOpenInApp.setOnClickListener(v -> {
            if (!currentSentence.isEmpty()) listener.onOpenInApp(currentSentence);
        });
        panelView.addView(panelOpenInApp);

        WindowManager.LayoutParams params = baseParams();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.gravity = Gravity.BOTTOM;
        params.flags &= ~WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
        params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
        params.y = 0;
        windowManager.addView(panelView, params);
    }

    private void renderHits() {
        clearHits();
        if (!pickOpen || panelOpen) return;
        int added = 0;
        int keepAbove =
            context.getResources().getDisplayMetrics().heightPixels - dp(170);
        for (ScreenReadBox box : latest) {
            List<int[]> strips = box.strips;
            if (strips.isEmpty()) {
                strips = new ArrayList<>();
                strips.add(new int[] { box.left, box.top, box.right, box.bottom });
            }
            for (int[] strip : strips) {
                if (added >= 48) return;
                if (strip[1] > keepAbove) continue;
                View hit = new View(context);
                GradientDrawable hitBg = new GradientDrawable();
                hitBg.setColor(Color.parseColor("#33FBBF24"));
                hitBg.setCornerRadius(dp(4));
                hit.setBackground(hitBg);
                hit.setContentDescription(box.text);
                ScreenReadBox target = box;
                hit.setOnClickListener(v -> listener.onAnalyzeRequested(target));
                WindowManager.LayoutParams params = baseParams();
                int padX = dp(8);
                int padY = dp(6);
                params.width = Math.max(dp(48), strip[2] - strip[0] + padX * 2);
                params.height = Math.max(dp(36), strip[3] - strip[1] + padY * 2);
                params.gravity = Gravity.TOP | Gravity.START;
                params.x = Math.max(0, strip[0] - padX);
                params.y = Math.max(0, strip[1] - padY);
                params.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
                try {
                    windowManager.addView(hit, params);
                    hitViews.add(hit);
                    added += 1;
                } catch (Exception ignored) {}
            }
        }
    }

    private void clearHits() {
        for (View hit : hitViews) {
            try {
                windowManager.removeView(hit);
            } catch (Exception ignored) {}
        }
        hitViews.clear();
    }

    private void restackBubble() {
        if (bubbleView == null || bubbleParams == null) return;
        try {
            windowManager.removeView(bubbleView);
        } catch (Exception ignored) {}
        try {
            windowManager.addView(bubbleView, bubbleParams);
        } catch (Exception ignored) {}
    }

    private String signature(List<ScreenReadBox> boxes) {
        StringBuilder buf = new StringBuilder();
        for (ScreenReadBox box : boxes) {
            buf.append(box.text)
                .append('|')
                .append(box.left / 8)
                .append(',')
                .append(box.top / 8)
                .append('\n');
        }
        return buf.toString();
    }

    private WindowManager.LayoutParams baseParams() {
        int type = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            : WindowManager.LayoutParams.TYPE_PHONE;
        return new WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        );
    }

    private int dp(int value) {
        return Math.round(value * context.getResources().getDisplayMetrics().density);
    }
}
