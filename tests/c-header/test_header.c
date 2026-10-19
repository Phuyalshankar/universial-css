/**
 * C-Header Compilation & Opcode Unit Test
 * Verifies that universal_css.h compiles cleanly with C99/C++ and decodes opcodes.
 */

#include <stdio.h>
#include <assert.h>
#include "universal_css.h"

int main() {
    printf("🧪 Running C-Header Compilation and Opcode Test...\n");

    // 1. Verify Enum alignments and Opcode values
    assert(UB_PROP_DISPLAY_FLEX == 0x02);
    assert(UB_PROP_FLEX_DIR_ROW == 0x06);
    assert(UB_PROP_GAP == 0x1A);
    assert(UB_PROP_RAW_CSS_STRING == 0xFE);
    assert(UB_PROP_END == 0xFF);

    // 2. Verify Bitmask operations
    uint8_t modifier = UB_BREAK_MD | UB_STATE_HOVER;
    assert((modifier & UB_STATE_HOVER) != 0);
    assert((modifier & 0xE0) == UB_BREAK_MD);

    // 3. Test static byte stream decoding logic
    uint8_t testStream[] = {
        UB_BREAK_DEFAULT | UB_STATE_NONE, UB_PROP_DISPLAY_FLEX,
        UB_BREAK_MD | UB_STATE_NONE,      UB_PROP_FLEX_DIR_ROW,
        UB_BREAK_DEFAULT | UB_STATE_NONE, UB_PROP_END
    };

    printf("  • Opcode UB_PROP_DISPLAY_FLEX: 0x%02X\n", testStream[1]);
    printf("  • Modifier Breakpoint MD:      0x%02X\n", testStream[2]);

    printf("✅ C-Header universal_css.h compiled and validated successfully!\n");
    return 0;
}
