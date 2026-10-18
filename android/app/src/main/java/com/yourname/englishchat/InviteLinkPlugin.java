package com.yourname.englishchat;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * 친구 초대 링크(src/lib/invite/).
 *
 * - share: 안드로이드 공유 창으로 초대 글을 보낸다(카카오톡·문자 등).
 * - takePending: 앱이 받은 초대. 앱이 있을 때 링크로 열린 경우(languagebank://invite?c=…)는
 *   그 링크, 없으면 설치 후 첫 실행 한 번만 Play 설치 경로(referrer "invite=…&room=…")를 읽는다.
 * - 앱이 켜져 있는데 링크가 오면 "inviteLink" 이벤트.
 */
@CapacitorPlugin(name = "InviteLink")
public class InviteLinkPlugin extends Plugin {

    private static final String PREFS = "invite_link";
    private static final String REFERRER_READ = "referrer_read";

    private static InviteLinkPlugin instance;
    private static String pendingCode;
    private static String pendingRoom;

    /** MainActivity가 링크로 열렸을 때 부른다. */
    static void deliverLink(Intent intent) {
        if (intent == null || !Intent.ACTION_VIEW.equals(intent.getAction())) return;
        Uri uri = intent.getData();
        if (uri == null || !"languagebank".equals(uri.getScheme()) || !"invite".equals(uri.getHost())) return;
        String code = uri.getQueryParameter("c");
        if (code == null || code.isEmpty()) return;
        pendingCode = code;
        pendingRoom = uri.getQueryParameter("room");
        if (instance != null) {
            JSObject data = new JSObject();
            data.put("code", pendingCode);
            data.put("room", pendingRoom == null ? "" : pendingRoom);
            instance.notifyListeners("inviteLink", data, true);
        }
    }

    @Override
    public void load() {
        instance = this;
    }

    @Override
    protected void handleOnDestroy() {
        if (instance == this) instance = null;
    }

    @PluginMethod
    public void takePending(PluginCall call) {
        if (pendingCode != null) {
            JSObject data = new JSObject();
            data.put("code", pendingCode);
            data.put("room", pendingRoom == null ? "" : pendingRoom);
            pendingCode = null;
            pendingRoom = null;
            call.resolve(data);
            return;
        }
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (prefs.getBoolean(REFERRER_READ, false)) {
            call.resolve(new JSObject());
            return;
        }
        final InstallReferrerClient client = InstallReferrerClient.newBuilder(getContext()).build();
        try {
            client.startConnection(new InstallReferrerStateListener() {
                @Override
                public void onInstallReferrerSetupFinished(int responseCode) {
                    JSObject data = new JSObject();
                    try {
                        if (responseCode == InstallReferrerClient.InstallReferrerResponse.OK) {
                            ReferrerDetails details = client.getInstallReferrer();
                            data.put("referrer", details.getInstallReferrer());
                        }
                    } catch (Exception ignored) {
                        // 읽지 못하면 초대 없음으로.
                    }
                    // 성공이든 아니든(기능 없음·지원 안 함) 다시 묻지 않는다. 연결이 잠깐 끊긴 경우만 다음에.
                    if (responseCode != InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE) {
                        prefs.edit().putBoolean(REFERRER_READ, true).apply();
                    }
                    try {
                        client.endConnection();
                    } catch (Exception ignored) {
                    }
                    call.resolve(data);
                }

                @Override
                public void onInstallReferrerServiceDisconnected() {
                    // onInstallReferrerSetupFinished가 이미 답했거나, 다음 실행에서 다시.
                }
            });
        } catch (Exception error) {
            call.resolve(new JSObject());
        }
    }

    @PluginMethod
    public void share(PluginCall call) {
        String text = call.getString("text", "");
        String title = call.getString("title", "");
        Intent send = new Intent(Intent.ACTION_SEND);
        send.setType("text/plain");
        send.putExtra(Intent.EXTRA_TEXT, text);
        Intent chooser = Intent.createChooser(send, title);
        chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(chooser);
        call.resolve();
    }
}
