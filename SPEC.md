# 📜 Universal CSS Binary Protocol Specification (v1.0.0)

This document formalizes the **Universal CSS Binary Representation (UB)** for encoding Tailwind design tokens into zero-overhead binary streams.

---

## 1. Stream & Packet Architecture

Universal CSS byte streams operate in **Big-Endian (Network Byte Order)**. Every stream starts with a **1-byte Version Marker (`0x01`)** and is terminated by an `END (0xFF)` opcode.

```
Offset 0: Version Byte (0x01)
Offset 1..N: Sequence of Property Descriptors
Offset End: Terminator Byte (0xFF)
```

### Property Descriptor Format

Each styled utility token is encoded as:
```
┌─────────────────┬─────────────────┬──────────────────────────────────────────┐
│ Modifier (1B)   │ Opcode (1B)     │ Value / Payload (0 to N Bytes)           │
│ [State | Break] │ [Property ID]   │ [Immediate UInt8, UInt16, RGB, or String]│
└─────────────────┴─────────────────┴──────────────────────────────────────────┘
```

---

## 2. Modifier Byte Bitmask (Offset 0 of Descriptor)

```
Bit:   7   6   5   4   3   2   1   0
     ┌───┬───┬───┬───┬───┬───┬───┬───┐
     │  Breakpoint  │ D │ B │ A │ F │ H │
     └──────────────┴───┴───┴───┴───┴───┘
```

### Breakpoint Flags (Bits 7–5)
| Value | Flag | Minimum Viewport Width |
|---|---|---|
| `0x00` | `DEFAULT` | Base (all viewports) |
| `0x20` | `BREAK_SM` | `@media (min-width: 640px)` |
| `0x40` | `BREAK_MD` | `@media (min-width: 768px)` |
| `0x60` | `BREAK_LG` | `@media (min-width: 1024px)` |
| `0x80` | `BREAK_XL` | `@media (min-width: 1280px)` |
| `0xA0` | `BREAK_2XL`| `@media (min-width: 1536px)` |

### State Flags (Bits 4–0)
| Bit | Flag | CSS Output Selector |
|---|---|---|
| Bit 0 (`0x01`) | `STATE_HOVER` | `.sel:hover` |
| Bit 1 (`0x02`) | `STATE_FOCUS` | `.sel:focus` |
| Bit 2 (`0x04`) | `STATE_ACTIVE` | `.sel:active` |
| Bit 3 (`0x08`) | `STATE_DISABLED` | `.sel:disabled` |
| Bit 4 (`0x10`) | `STATE_DARK` | `@media (prefers-color-scheme: dark) { .sel { ... } }` |

---

## 3. Core Design Token Opcodes

| Opcode | Identifier | Payload Format | Description | Output CSS Example |
|---|---|---|---|---|
| `0x02` | `DISPLAY_FLEX` | None | Flexbox container | `display: flex` |
| `0x06` | `FLEX_DIR_ROW` | None | Flex row | `flex-direction: row` |
| `0x08` | `FLEX_DIR_COL` | None | Flex col | `flex-direction: column` |
| `0x1A` | `GAP` | `1B UInt8` (quarter units) | Gap spacing | `gap: 0.375rem` (for `gap-1.5`) |
| `0x20` | `M_ALL` | `1B UInt8` | Margin all | `margin: 1rem` (for `m-4`) |
| `0x28` | `P_ALL` | `1B UInt8` | Padding all | `padding: 0.25rem` (for `p-1`) |
| `0x40` | `W_FULL` | None | Width 100% | `width: 100%` |
| `0x46` | `W_PX` | `2B UInt16 BE` | Width pixels | `width: 800px` |
| `0x50` | `BG_COLOR_NAMED` | `1B ColorIdx, 1B ShadeIdx` | Tailwind Palette | `background-color: #0f172a` (slate-900) |
| `0x51` | `BG_COLOR_RGB` | `3B (R, G, B)` | Custom Hex | `background-color: rgb(15,23,42)` |
| `0x52` | `TEXT_COLOR_NAMED`| `1B ColorIdx, 1B ShadeIdx` | Tailwind Palette | `color: #38bdf8` (sky-400) |
| `0x70` | `FONT_SIZE_SCALE` | `1B ScaleCode` (1 to 8) | Font scale rem | `font-size: 1.25rem` (for `text-xl`) |
| `0x80` | `TRANSFORM_SCALE` | `1B UInt8` | Scale percentage | `transform: scale(1.05)` |
| `0xFE` | `RAW_CSS_STRING` | `2B Length BE + UTF-8 Bytes` | Fallback Escape Hatch | Arbitrary `calc()`, invalid hex, plugins |
| `0xFF` | `END` | None | Stream terminator | Ends parser loop |

---

## 4. Spacing Scale Definition (rem Output)

Universal CSS strictly outputs **`rem`** for all spacing primitives:
- Formula: `rem = (value_in_quarter_steps * 0.0625)rem`
- Examples:
  - `p-0.5` -> encoded unit `2` -> `0.125rem` (2px)
  - `p-1` -> encoded unit `4` -> `0.25rem` (4px)
  - `p-4` -> encoded unit `16` -> `1rem` (16px)
  - `gap-1.5` -> encoded unit `6` -> `0.375rem` (6px)

---

## 5. The `0xFE` Escape Hatch Guarantee

Any utility, plugin, or arbitrary expression not represented as a first-class mathematical token is wrapped in Opcode `0xFE`. This ensures:
- **Zero dropped rules:** Expressions like `w-[calc(100%-32px)]` survive untouched.
- **Invalid hex safety:** Malformed hexes like `bg-[#xyz]` are safely emitted as fallback CSS strings instead of causing crashes or turning silently black.
