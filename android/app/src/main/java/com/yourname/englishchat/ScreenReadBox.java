package com.yourname.englishchat;

final class ScreenReadBox {
    final int left;
    final int top;
    final int right;
    final int bottom;
    final String text;
    final String line;

    ScreenReadBox(int left, int top, int right, int bottom, String text, String line) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.text = text;
        this.line = line;
    }
}
