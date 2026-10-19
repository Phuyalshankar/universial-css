package com.titan.universalcss

import android.content.Context
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import java.nio.ByteBuffer

/**
 * 🐬 Universal CSS Android Skia / Native Decoder (Minimal Working Demo)
 * Decodes Universal Binary Opcodes directly into Android hardware-accelerated Views.
 */
class UniversalCssAndroidDecoder(private val context: Context) {

    companion object {
        const val OP_DISPLAY_FLEX = 0x02
        const val OP_FLEX_ROW     = 0x06
        const val OP_FLEX_COL     = 0x08
        const val OP_P_ALL        = 0x28
        const val OP_M_ALL        = 0x20
        const val OP_BG_COLOR_RGB = 0x50
        const val OP_TEXT_RGB     = 0x52
        const val OP_END          = 0xFF
    }

    fun decodeToView(bytes: ByteArray): View {
        val buffer = ByteBuffer.wrap(bytes)
        val layout = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
        }

        while (buffer.hasRemaining()) {
            val modifier = buffer.get().toInt() and 0xFF
            val op = buffer.get().toInt() and 0xFF

            if (op == OP_END) break

            when (op) {
                OP_FLEX_ROW -> layout.orientation = LinearLayout.HORIZONTAL
                OP_FLEX_COL -> layout.orientation = LinearLayout.VERTICAL
                OP_P_ALL -> {
                    val p = (buffer.get().toInt() and 0xFF) * 4
                    layout.setPadding(p, p, p, p)
                }
                OP_M_ALL -> {
                    val m = (buffer.get().toInt() and 0xFF) * 4
                    val lp = ViewGroup.MarginLayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
                    lp.setMargins(m, m, m, m)
                    layout.layoutParams = lp
                }
                OP_BG_COLOR_RGB -> {
                    val r = buffer.get().toInt() and 0xFF
                    val g = buffer.get().toInt() and 0xFF
                    val b = buffer.get().toInt() and 0xFF
                    layout.setBackgroundColor(Color.rgb(r, g, b))
                }
            }
        }

        return layout
    }
}
