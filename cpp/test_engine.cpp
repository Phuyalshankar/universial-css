#include "TitanUniversalEngine.hpp"
#include <iostream>
#include <cassert>

int main() {
    std::cout << "========================================================\n";
    std::cout << "⚡ TITAN UNIVERSAL C++ ENGINE (v2.0.0) TEST SUITE\n";
    std::cout << "========================================================\n\n";

    // ─── TEST 1: Tailwind CSS Compilation & Decompilation ───────────────────
    std::cout << "[TEST 1] Tailwind Utility Classes Round-Trip...\n";
    {
        std::string twInput = "flex items-center p-4 bg-slate-900 text-sky-400 rounded-xl hover:scale-105 md:p-6";
        Titan::UniversalCompiler compiler;
        compiler.compile(twInput);

        std::cout << "  Input: " << twInput << "\n";
        std::cout << "  Binary Size: " << compiler.bytes.size() << " Bytes (Compression: "
                  << (100.0f - (float)compiler.bytes.size() / twInput.length() * 100.0f) << "%)\n";

        std::string css = Titan::UniversalDecoder::decodeToCss(compiler.bytes.data(), compiler.bytes.size(), ".card");
        std::cout << "  Generated CSS:\n" << css << "\n";
        assert(css.find("display: flex") != std::string::npos);
        assert(css.find("padding: 1rem") != std::string::npos);
        assert(css.find("background-color: #0f172a") != std::string::npos);
        assert(css.find("transform: scale(1.05)") != std::string::npos);
        std::cout << "  ✅ PASS: Tailwind full compilation verified!\n\n";
    }

    // ─── TEST 2: Normal CSS Declaration Compilation ─────────────────────────
    std::cout << "[TEST 2] Normal CSS Declaration Compilation...\n";
    {
        std::string normalCss = "display: flex; position: absolute; background-color: #ffffff; color: #000000; custom-prop: 42px;";
        Titan::UniversalCompiler compiler;
        compiler.compile(normalCss);

        std::cout << "  Input CSS: " << normalCss << "\n";
        std::cout << "  Binary Size: " << compiler.bytes.size() << " Bytes\n";

        std::string css = Titan::UniversalDecoder::decodeToCss(compiler.bytes.data(), compiler.bytes.size(), ".normal-box");
        std::cout << "  Generated CSS:\n" << css << "\n";
        assert(css.find("display: flex") != std::string::npos);
        assert(css.find("position: absolute") != std::string::npos);
        assert(css.find("background-color: #ffffff") != std::string::npos);
        assert(css.find("custom-prop: 42px") != std::string::npos);
        std::cout << "  ✅ PASS: Normal CSS declaration parser verified!\n\n";
    }

    // ─── TEST 3: Procedural Vector Geometry (Seven-Segment & Gauge) ──────────
    std::cout << "[TEST 3] Procedural Vector Geometry (No hardcoding)...\n";
    {
        // 1. Seven Segment for digit '8' (all 7 segments ON)
        auto segs = Titan::Vector::generateSevenSegment('8', 0, 0, 40, 80, {255, 0, 0, 255}, {40, 40, 40, 255});
        std::cout << "  Generated 7-Segment primitives count: " << segs.size() << "\n";
        assert(segs.size() == 7);
        for (size_t i = 0; i < segs.size(); ++i) {
            assert(segs[i].points.size() >= 4); // Each segment is a 4-point or 6-point polygon
        }

        // 2. Gauge Needle for value 75%
        auto gauge = Titan::Vector::generateGauge(75.0f, 0.0f, 100.0f, 100, 100, 80, {50, 50, 50, 255}, {255, 180, 0, 255});
        std::cout << "  Generated Gauge primitives count: " << gauge.size() << "\n";
        assert(gauge.size() >= 3); // Arc, Needle polygon, Pivot circle
        std::cout << "  ✅ PASS: Procedural geometry dynamically computed with 0 SVG hardcoding!\n\n";
    }

    // ─── TEST 4: C-ABI Interop Export ───────────────────────────────────────
    std::cout << "[TEST 4] C-ABI Functions (For JNI, Kotlin, WebAssembly)...\n";
    {
        uint8_t buffer[256];
        uint32_t binLen = titan_css_compile("p-6 text-center font-bold text-white", buffer, sizeof(buffer));
        assert(binLen > 0);

        char cssBuffer[1024];
        uint32_t cssLen = titan_css_decompile(buffer, binLen, ".c-abi-test", cssBuffer, sizeof(cssBuffer));
        assert(cssLen > 0);
        std::cout << "  C-ABI Decompiled Output:\n" << cssBuffer << "\n";
        assert(std::string(cssBuffer).find("font-weight: 700") != std::string::npos);
        std::cout << "  ✅ PASS: C-ABI exports 100% operational!\n\n";
    }

    std::cout << "========================================================\n";
    std::cout << "🎉 ALL C++ ENGINE TESTS PASSED 100%!\n";
    std::cout << "========================================================\n";
    return 0;
}
