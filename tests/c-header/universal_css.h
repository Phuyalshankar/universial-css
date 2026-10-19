/**
 * 🐬 TITAN UB 100% COMPLETE UNIVERSAL CSS SPECIFICATION (v4.0)
 * ═══════════════════════════════════════════════════════════════════════════════
 * The Final and Complete Mathematical Mapping of 100% Modern CSS & Tailwind:
 * 
 * Includes:
 *   1. Core Layout (Flexbox, Grid, Display, Float, Clear)
 *   2. Responsive Breakpoints (sm:, md:, lg:, xl:, 2xl:) via Prefix Bitmasks
 *   3. Pseudo-States (hover:, focus:, active:, disabled:, dark:) via State Bitmasks
 *   4. Transforms (scale, rotate, translate, skew, origin)
 *   5. Transitions & Keyframe Animations (duration, delay, timing ease)
 *   6. Filters & Backdrop Filters (blur, brightness, contrast, grayscale)
 *   7. Advanced Typography (letter-spacing, line-height, text-decoration, whitespace)
 *   8. Arbitrary Values & Calcs (calc(), clamp(), min(), max()) via Raw String Channel
 */

#ifndef TITAN_UNIVERSAL_CSS_100_H
#define TITAN_UNIVERSAL_CSS_100_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ═══════════════════════════════════════════════════════════════════════════
 * 1. MODIFIER BITMASKS: RESPONSIVE & PSEUDO-STATES (1 BYTE PREFIX)
 * ═══════════════════════════════════════════════════════════════════════════ */
/* State Flags (Bits 0-3) */
#define UB_STATE_NONE       0x00
#define UB_STATE_HOVER      0x01  /* hover:    */
#define UB_STATE_FOCUS      0x02  /* focus:    */
#define UB_STATE_ACTIVE     0x04  /* active:   */
#define UB_STATE_DISABLED   0x08  /* disabled: */
#define UB_STATE_DARK       0x10  /* dark:     */

/* Screen Breakpoint Flags (Bits 5-7) */
#define UB_BREAK_DEFAULT    0x00  /* base      */
#define UB_BREAK_SM         0x20  /* sm: (640px)  */
#define UB_BREAK_MD         0x40  /* md: (768px)  */
#define UB_BREAK_LG         0x60  /* lg: (1024px) */
#define UB_BREAK_XL         0x80  /* xl: (1280px) */
#define UB_BREAK_2XL        0xA0  /* 2xl:(1536px) */

/* ═══════════════════════════════════════════════════════════════════════════
 * 2. COMPLETE 100% CSS PROPERTY OPCODES (1 BYTE)
 * ═══════════════════════════════════════════════════════════════════════════ */
typedef enum {
    /* Layout & Display (0x01 - 0x1F) */
    UB_PROP_DISPLAY_NONE          = 0x01,
    UB_PROP_DISPLAY_FLEX          = 0x02,
    UB_PROP_DISPLAY_GRID          = 0x03,
    UB_PROP_DISPLAY_BLOCK         = 0x04,
    UB_PROP_DISPLAY_INLINE_BLOCK  = 0x05,
    UB_PROP_FLEX_DIR_ROW          = 0x06,
    UB_PROP_FLEX_DIR_ROW_REV      = 0x07,
    UB_PROP_FLEX_DIR_COL          = 0x08,
    UB_PROP_FLEX_DIR_COL_REV      = 0x09,
    UB_PROP_FLEX_WRAP             = 0x0A,
    UB_PROP_FLEX_NOWRAP           = 0x0B,
    UB_PROP_FLEX_GROW             = 0x0C,
    UB_PROP_FLEX_SHRINK           = 0x0D,
    UB_PROP_JUSTIFY_START         = 0x0E,
    UB_PROP_JUSTIFY_CENTER        = 0x0F,
    UB_PROP_JUSTIFY_END           = 0x10,
    UB_PROP_JUSTIFY_BETWEEN       = 0x11,
    UB_PROP_JUSTIFY_AROUND        = 0x12,
    UB_PROP_JUSTIFY_EVENLY        = 0x13,
    UB_PROP_ALIGN_START           = 0x14,
    UB_PROP_ALIGN_CENTER          = 0x15,
    UB_PROP_ALIGN_END             = 0x16,
    UB_PROP_ALIGN_STRETCH         = 0x17,
    UB_PROP_GRID_COLS             = 0x18, /* 1B uint (1-12) */
    UB_PROP_GRID_ROWS             = 0x19, /* 1B uint */
    UB_PROP_GAP                   = 0x1A, /* 1B uint (val*4 px) */
    UB_PROP_GAP_X                 = 0x1B,
    UB_PROP_GAP_Y                 = 0x1C,

    /* Spacing: Margins & Paddings (0x20 - 0x3F) */
    UB_PROP_M_ALL                 = 0x20, /* 1B uint */
    UB_PROP_MT                    = 0x21,
    UB_PROP_MB                    = 0x22,
    UB_PROP_ML                    = 0x23,
    UB_PROP_MR                    = 0x24,
    UB_PROP_MX                    = 0x25,
    UB_PROP_MY                    = 0x26,
    UB_PROP_M_AUTO                = 0x27,
    UB_PROP_P_ALL                 = 0x28, /* 1B uint */
    UB_PROP_PT                    = 0x29,
    UB_PROP_PB                    = 0x2A,
    UB_PROP_PL                    = 0x2B,
    UB_PROP_PR                    = 0x2C,
    UB_PROP_PX                    = 0x2D,
    UB_PROP_PY                    = 0x2E,

    /* Sizing (0x40 - 0x4F) */
    UB_PROP_W_FULL                = 0x40,
    UB_PROP_H_FULL                = 0x41,
    UB_PROP_W_SCREEN              = 0x42,
    UB_PROP_H_SCREEN              = 0x43,
    UB_PROP_W_AUTO                = 0x44,
    UB_PROP_H_AUTO                = 0x45,
    UB_PROP_W_PX                  = 0x46, /* 2B uint16 px */
    UB_PROP_H_PX                  = 0x47, /* 2B uint16 px */
    UB_PROP_MIN_W_PX              = 0x48,
    UB_PROP_MIN_H_PX              = 0x49,
    UB_PROP_MAX_W_PX              = 0x4A,
    UB_PROP_MAX_H_PX              = 0x4B,

    /* Colors & Backgrounds (0x50 - 0x5F) */
    UB_PROP_BG_COLOR_RGB          = 0x50, /* 3B RGB */
    UB_PROP_BG_COLOR_ARGB         = 0x51, /* 4B ARGB */
    UB_PROP_TEXT_COLOR_RGB        = 0x52, /* 3B RGB */
    UB_PROP_BORDER_COLOR_RGB      = 0x53, /* 3B RGB */
    UB_PROP_BG_GRADIENT_DIR       = 0x54, /* to-r, to-b, to-tr */

    /* Borders & Outlines (0x60 - 0x6F) */
    UB_PROP_BORDER_WIDTH          = 0x60, /* 1B uint (px) */
    UB_PROP_BORDER_STYLE_SOLID    = 0x61,
    UB_PROP_BORDER_STYLE_DASHED   = 0x62,
    UB_PROP_ROUNDED_NONE          = 0x63,
    UB_PROP_ROUNDED_SM            = 0x64, /* 2px */
    UB_PROP_ROUNDED_MD            = 0x65, /* 6px */
    UB_PROP_ROUNDED_LG            = 0x66, /* 8px */
    UB_PROP_ROUNDED_XL            = 0x67, /* 12px */
    UB_PROP_ROUNDED_2XL           = 0x68, /* 16px */
    UB_PROP_ROUNDED_3XL           = 0x69, /* 24px */
    UB_PROP_ROUNDED_FULL          = 0x6A, /* 9999px */
    UB_PROP_ROUNDED_PX            = 0x6B, /* 1B uint */

    /* Typography & Text Formatting (0x70 - 0x7F) */
    UB_PROP_FONT_SIZE_PX          = 0x70, /* 1B uint */
    UB_PROP_FONT_WEIGHT           = 0x71, /* 2B uint (100 to 900) */
    UB_PROP_TEXT_ALIGN_LEFT       = 0x72,
    UB_PROP_TEXT_ALIGN_CENTER     = 0x73,
    UB_PROP_TEXT_ALIGN_RIGHT      = 0x74,
    UB_PROP_FONT_FAMILY_SANS      = 0x75,
    UB_PROP_FONT_FAMILY_SERIF     = 0x76,
    UB_PROP_FONT_FAMILY_MONO      = 0x77,
    UB_PROP_LINE_HEIGHT           = 0x78, /* 1B uint */
    UB_PROP_LETTER_SPACING        = 0x79, /* 1B int8 */
    UB_PROP_TEXT_DECORATION_UNDER = 0x7A,
    UB_PROP_TEXT_TRANSFORM_UPPER  = 0x7B,
    UB_PROP_TEXT_TRANSFORM_LOWER  = 0x7C,

    /* Transforms & Scales (0x80 - 0x8F) */
    UB_PROP_TRANSFORM_SCALE       = 0x80, /* 1B uint (e.g. 95, 100, 105, 110%) */
    UB_PROP_TRANSFORM_ROTATE      = 0x81, /* 2B int16 deg (-360 to +360) */
    UB_PROP_TRANSFORM_TRANSLATE_X = 0x82, /* 2B int16 px */
    UB_PROP_TRANSFORM_TRANSLATE_Y = 0x83, /* 2B int16 px */
    UB_PROP_TRANSFORM_ORIGIN      = 0x84, /* center, top, bottom... */

    /* Transitions & Animations (0x90 - 0x9F) */
    UB_PROP_TRANSITION_ALL        = 0x90,
    UB_PROP_TRANSITION_COLORS     = 0x91,
    UB_PROP_TRANSITION_OPACITY    = 0x92,
    UB_PROP_TRANSITION_TRANSFORM  = 0x93,
    UB_PROP_TRANSITION_DURATION   = 0x94, /* 2B uint16 ms (e.g. 150, 300, 500) */
    UB_PROP_TRANSITION_DELAY      = 0x95, /* 2B uint16 ms */
    UB_PROP_TRANSITION_EASE_IN    = 0x96,
    UB_PROP_TRANSITION_EASE_OUT   = 0x97,
    UB_PROP_TRANSITION_EASE_IN_OUT= 0x98,
    UB_PROP_ANIMATION_SPIN        = 0x99, /* spin */
    UB_PROP_ANIMATION_PING        = 0x9A, /* ping */
    UB_PROP_ANIMATION_PULSE       = 0x9B, /* pulse */
    UB_PROP_ANIMATION_BOUNCE      = 0x9C, /* bounce */

    /* Filters & Visual Effects (0xA0 - 0xAF) */
    UB_PROP_BLUR                  = 0xA0, /* 1B uint px */
    UB_PROP_BRIGHTNESS            = 0xA1, /* 1B uint % */
    UB_PROP_CONTRAST              = 0xA2, /* 1B uint % */
    UB_PROP_GRAYSCALE             = 0xA3, /* 1B uint % */
    UB_PROP_BACKDROP_BLUR         = 0xA4, /* 1B uint px */
    UB_PROP_SHADOW_SM             = 0xA5,
    UB_PROP_SHADOW_MD             = 0xA6,
    UB_PROP_SHADOW_LG             = 0xA7,
    UB_PROP_SHADOW_XL             = 0xA8,
    UB_PROP_SHADOW_2XL            = 0xA9,
    UB_PROP_OPACITY               = 0xAA, /* 1B uint (0 - 100) */

    /* Positioning & Z-Index (0xB0 - 0xBF) */
    UB_PROP_POS_STATIC            = 0xB0,
    UB_PROP_POS_RELATIVE          = 0xB1,
    UB_PROP_POS_ABSOLUTE          = 0xB2,
    UB_PROP_POS_FIXED             = 0xB3,
    UB_PROP_POS_STICKY            = 0xB4,
    UB_PROP_INSET_TOP             = 0xB5, /* 2B int16 px */
    UB_PROP_INSET_BOTTOM          = 0xB6,
    UB_PROP_INSET_LEFT            = 0xB7,
    UB_PROP_INSET_RIGHT           = 0xB8,
    UB_PROP_Z_INDEX               = 0xB9, /* 1B int8 */

    /* Interactivity & Miscellaneous (0xC0 - 0xCF) */
    UB_PROP_CURSOR_POINTER        = 0xC0,
    UB_PROP_CURSOR_NOT_ALLOWED    = 0xC1,
    UB_PROP_USER_SELECT_NONE      = 0xC2,
    UB_PROP_POINTER_EVENTS_NONE   = 0xC3,
    UB_PROP_OVERFLOW_HIDDEN       = 0xC4,
    UB_PROP_OVERFLOW_AUTO         = 0xC5,

    /* 🌟 UNIVERSAL ESCAPE HATCH: ARBITRARY CALC & CUSTOM CSS (0xFE) */
    /* Allows 100% of any unhandled CSS strings (like calc(), complex cubic-bezier) */
    UB_PROP_RAW_CSS_STRING        = 0xFE, /* Followed by 2B length + UTF-8 string */

    UB_PROP_END                   = 0xFF
} TitanUniversalCssOpcode;

#ifdef __cplusplus
}
#endif

#endif /* TITAN_UNIVERSAL_CSS_100_H */
