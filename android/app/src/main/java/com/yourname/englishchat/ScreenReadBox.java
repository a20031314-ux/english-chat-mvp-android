package com.yourname.englishchat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

final class ScreenReadBox {
    final int left;
    final int top;
    final int right;
    final int bottom;
    final String text;
    final String line;
    /** Line strips {left, top, right, bottom} for invisible taps. */
    final List<int[]> strips;

    ScreenReadBox(int left, int top, int right, int bottom, String text, String line) {
        this(left, top, right, bottom, text, line, Collections.emptyList());
    }

    ScreenReadBox(
        int left,
        int top,
        int right,
        int bottom,
        String text,
        String line,
        List<int[]> strips
    ) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.text = text;
        this.line = line;
        this.strips = strips == null || strips.isEmpty()
            ? Collections.emptyList()
            : Collections.unmodifiableList(new ArrayList<>(strips));
    }
}
