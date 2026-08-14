package com.yourname.englishchat;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.Image;
import android.media.ImageReader;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.view.WindowManager;
import androidx.core.app.NotificationCompat;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

public class ScreenReadService extends Service {
    public static final String EXTRA_RESULT_CODE = "resultCode";
    public static final String EXTRA_RESULT_DATA = "resultData";
    public static final String EXTRA_API_BASE = "apiBase";
    public static final String EXTRA_LOCALE = "locale";
    public static final String EXTRA_ANALYZE_LABEL = "analyzeLabel";
    private static final String CHANNEL_ID = "screen_read";
    private static final int NOTIF_ID = 71;
    private static final int LOOP_MS = 900;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private MediaProjection projection;
    private VirtualDisplay virtualDisplay;
    private ImageReader imageReader;
    private ScreenReadOverlay overlay;
    private ScreenReadAnalyzer analyzer;
    private boolean running;
    private boolean ocrBusy;
    private int screenWidth;
    private int screenHeight;
    private int densityDpi;

    public static void start(
        Context context,
        int resultCode,
        Intent data,
        String apiBase,
        String locale,
        String analyzeLabel
    ) {
        Intent intent = new Intent(context, ScreenReadService.class);
        intent.putExtra(EXTRA_RESULT_CODE, resultCode);
        intent.putExtra(EXTRA_RESULT_DATA, data);
        intent.putExtra(EXTRA_API_BASE, apiBase);
        intent.putExtra(EXTRA_LOCALE, locale);
        intent.putExtra(EXTRA_ANALYZE_LABEL, analyzeLabel);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
    }

    public static void stop(Context context) {
        context.stopService(new Intent(context, ScreenReadService.class));
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf();
            return START_NOT_STICKY;
        }
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(getString(R.string.screen_read_running))
            .setContentText(getString(R.string.screen_read_running_body))
            .setSmallIcon(R.mipmap.ic_launcher)
            .setOngoing(true)
            .setContentIntent(
                PendingIntent.getActivity(
                    this,
                    0,
                    new Intent(this, MainActivity.class),
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                )
            )
            .build();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIF_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
        } else {
            startForeground(NOTIF_ID, notification);
        }

        String apiBase = intent.getStringExtra(EXTRA_API_BASE);
        String locale = intent.getStringExtra(EXTRA_LOCALE);
        String analyzeLabel = intent.getStringExtra(EXTRA_ANALYZE_LABEL);
        if (analyzeLabel == null || analyzeLabel.isEmpty()) analyzeLabel = getString(R.string.process_text_analyze);
        analyzer = new ScreenReadAnalyzer(
            apiBase == null || apiBase.isEmpty() ? "https://english-chat-mvp.vercel.app" : apiBase,
            locale
        );
        overlay = new ScreenReadOverlay(this, analyzeLabel, new ScreenReadOverlay.Listener() {
            @Override
            public void onPickRequested() {
                if (overlay != null) overlay.openPick();
            }

            @Override
            public void onStopRequested() {
                stopSelf();
            }

            @Override
            public void onAnalyzeRequested(ScreenReadBox box) {
                if (analyzer == null || overlay == null) return;
                analyzer.analyze(box.text, box.line, new ScreenReadAnalyzer.Callback() {
                    @Override
                    public void onLoading(String selected, String sentence) {
                        if (overlay != null) overlay.showLoading(selected);
                    }

                    @Override
                    public void onResult(String title, String body) {
                        if (overlay != null) overlay.showResult(title, body);
                    }

                    @Override
                    public void onError() {
                        if (overlay != null) overlay.showError();
                    }
                });
            }

            @Override
            public void onAnalysisClosed() {
                // back to browsing the underlying app
            }
        });
        overlay.show();

        DisplayMetrics metrics = new DisplayMetrics();
        WindowManager wm = (WindowManager) getSystemService(WINDOW_SERVICE);
        wm.getDefaultDisplay().getRealMetrics(metrics);
        screenWidth = metrics.widthPixels;
        screenHeight = metrics.heightPixels;
        densityDpi = metrics.densityDpi;

        int resultCode = intent.getIntExtra(EXTRA_RESULT_CODE, 0);
        Intent data = Build.VERSION.SDK_INT >= 33
            ? intent.getParcelableExtra(EXTRA_RESULT_DATA, Intent.class)
            : intent.getParcelableExtra(EXTRA_RESULT_DATA);
        MediaProjectionManager manager =
            (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
        if (manager == null || data == null) {
            stopSelf();
            return START_NOT_STICKY;
        }
        projection = manager.getMediaProjection(resultCode, data);
        if (projection == null) {
            stopSelf();
            return START_NOT_STICKY;
        }
        projection.registerCallback(new MediaProjection.Callback() {
            @Override
            public void onStop() {
                stopSelf();
            }
        }, handler);

        imageReader = ImageReader.newInstance(screenWidth, screenHeight, PixelFormat.RGBA_8888, 2);
        virtualDisplay = projection.createVirtualDisplay(
            "talkbank-screen-read",
            screenWidth,
            screenHeight,
            densityDpi,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            imageReader.getSurface(),
            null,
            handler
        );
        running = true;
        handler.post(this::loop);
        return START_STICKY;
    }

    private void loop() {
        if (!running) return;
        if (overlay == null || overlay.isPickOpen() || overlay.isPanelOpen() || ocrBusy) {
            handler.postDelayed(this::loop, LOOP_MS);
            return;
        }
        Bitmap bitmap = capture();
        if (bitmap == null) {
            handler.postDelayed(this::loop, LOOP_MS);
            return;
        }
        ocrBusy = true;
        InputImage image = InputImage.fromBitmap(bitmap, 0);
        TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            .process(image)
            .addOnSuccessListener(text -> {
                overlay.setBoxes(toBoxes(text, bitmap.getWidth(), bitmap.getHeight()));
                bitmap.recycle();
                ocrBusy = false;
            })
            .addOnFailureListener(error -> {
                bitmap.recycle();
                ocrBusy = false;
            });
        handler.postDelayed(this::loop, LOOP_MS);
    }

    private Bitmap capture() {
        if (imageReader == null) return null;
        Image image = imageReader.acquireLatestImage();
        if (image == null) return null;
        try {
            Image.Plane plane = image.getPlanes()[0];
            ByteBuffer buffer = plane.getBuffer();
            int pixelStride = plane.getPixelStride();
            int rowStride = plane.getRowStride();
            int rowPadding = rowStride - pixelStride * image.getWidth();
            Bitmap raw = Bitmap.createBitmap(
                image.getWidth() + rowPadding / pixelStride,
                image.getHeight(),
                Bitmap.Config.ARGB_8888
            );
            raw.copyPixelsFromBuffer(buffer);
            if (raw.getWidth() == image.getWidth()) return raw;
            Bitmap cropped = Bitmap.createBitmap(raw, 0, 0, image.getWidth(), image.getHeight());
            raw.recycle();
            return cropped;
        } catch (Exception e) {
            return null;
        } finally {
            image.close();
        }
    }

    private List<ScreenReadBox> toBoxes(Text text, int imageWidth, int imageHeight) {
        List<ScreenReadBox> boxes = new ArrayList<>();
        float sx = screenWidth / (float) Math.max(1, imageWidth);
        float sy = screenHeight / (float) Math.max(1, imageHeight);
        for (Text.TextBlock block : text.getTextBlocks()) {
            for (Text.Line line : block.getLines()) {
                String lineText = line.getText() == null ? "" : line.getText().replaceAll("\\s+", " ").trim();
                if (lineText.isEmpty() || !lineText.matches(".*\\p{L}.*")) continue;
                for (Text.Element element : line.getElements()) {
                    if (element.getBoundingBox() == null) continue;
                    String word = element.getText() == null ? "" : element.getText().trim();
                    if (word.isEmpty() || !word.matches(".*\\p{L}.*")) continue;
                    android.graphics.Rect r = element.getBoundingBox();
                    boxes.add(new ScreenReadBox(
                        Math.round(r.left * sx),
                        Math.round(r.top * sy),
                        Math.round(r.right * sx),
                        Math.round(r.bottom * sy),
                        word,
                        lineText
                    ));
                    if (boxes.size() >= 40) return boxes;
                }
            }
        }
        return boxes;
    }

    @Override
    public void onDestroy() {
        running = false;
        handler.removeCallbacksAndMessages(null);
        if (virtualDisplay != null) {
            virtualDisplay.release();
            virtualDisplay = null;
        }
        if (imageReader != null) {
            imageReader.close();
            imageReader = null;
        }
        if (projection != null) {
            projection.stop();
            projection = null;
        }
        if (overlay != null) {
            overlay.destroy();
            overlay = null;
        }
        if (analyzer != null) {
            analyzer.shutdown();
            analyzer = null;
        }
        super.onDestroy();
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            getString(R.string.screen_read_running),
            NotificationManager.IMPORTANCE_LOW
        );
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) manager.createNotificationChannel(channel);
    }
}
