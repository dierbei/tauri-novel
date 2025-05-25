#!/bin/bash
set -e

# 配置项
DEFAULT_COLOR="#ffffff"    # 默认状态栏颜色
ENABLE_AUTO_DETECTION=true # 启用自动颜色检测
DETECTION_INTERVAL=100     # 检测间隔(毫秒)

echo "🚀 正在配置智能 Android 状态栏自适应..."
echo "🤖 自动检测: $ENABLE_AUTO_DETECTION"

# 查找 MainActivity.kt
echo "🔍 正在查找 MainActivity.kt ..."
MAIN_ACTIVITY_DIRS=(
    "src-tauri/gen/android/app/src/main/java"
    "src-tauri/gen/android/app/src/main/kotlin"
)

FILE=""
for dir in "${MAIN_ACTIVITY_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        FILE=$(find "$dir" -name MainActivity.kt 2>/dev/null | head -1)
        if [ -n "$FILE" ]; then
            break
        fi
    fi
done

if [ -z "$FILE" ]; then
    echo "❌ MainActivity.kt 未找到"
    exit 1
fi

echo "✅ 找到 MainActivity.kt: $FILE"

# 备份
BACKUP_FILE="${FILE}.bak.$(date +%Y%m%d_%H%M%S)"
cp "$FILE" "$BACKUP_FILE"
echo "💾 已备份: $BACKUP_FILE"

# 读取包名
PACKAGE_LINE=$(grep '^package ' "$FILE")
echo "📦 包名: $PACKAGE_LINE"

# 创建智能 MainActivity.kt
cat > "$FILE" <<'EOF'
PACKAGE_PLACEHOLDER

import android.animation.ValueAnimator
import android.graphics.Bitmap
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.WebView
import androidx.core.graphics.ColorUtils
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import kotlin.math.abs
import kotlin.math.sqrt

class MainActivity : TauriActivity() {
    private var currentStatusBarColor = Color.WHITE
    private var isLightStatusBar = true
    private val handler = Handler(Looper.getMainLooper())
    private var colorDetectionRunnable: Runnable? = null
    private val colorAnimator = ValueAnimator()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setupWindow()
        startColorDetection()
    }

    private fun setupWindow() {
        // 启用边到边显示
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        // 初始状态栏设置
        updateStatusBar(Color.WHITE, true)
        
        // 处理窗口插入
        val rootView = findViewById<View>(android.R.id.content)
        ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
            val statusBarInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            view.setPadding(0, statusBarInsets.top, 0, 0)
            insets
        }
    }

    private fun startColorDetection() {
        if (!ENABLE_AUTO_DETECTION_PLACEHOLDER) return
        
        colorDetectionRunnable = object : Runnable {
            override fun run() {
                detectAndUpdateStatusBarColor()
                handler.postDelayed(this, DETECTION_INTERVAL_PLACEHOLDER.toLong())
            }
        }
        
        // 延迟启动，等待 WebView 加载
        handler.postDelayed(colorDetectionRunnable!!, 1000)
    }

    private fun detectAndUpdateStatusBarColor() {
        val webView = findWebView(findViewById(android.R.id.content))
        webView?.let { wv ->
            captureWebViewTopColor(wv) { color ->
                if (color != null && shouldUpdateColor(color)) {
                    val isLight = isColorLight(color)
                    animateStatusBarColor(color, !isLight)
                }
            }
        }
    }

    private fun findWebView(view: View): WebView? {
        return when (view) {
            is WebView -> view
            is android.view.ViewGroup -> {
                for (i in 0 until view.childCount) {
                    findWebView(view.getChildAt(i))?.let { return it }
                }
                null
            }
            else -> null
        }
    }

    private fun captureWebViewTopColor(webView: WebView, callback: (Int?) -> Unit) {
        try {
            // 执行 JavaScript 获取页面顶部颜色
            webView.evaluateJavascript("""
                (function() {
                    // 获取页面顶部元素的背景色
                    var topElements = document.elementsFromPoint(window.innerWidth / 2, 50);
                    for (var element of topElements) {
                        var style = window.getComputedStyle(element);
                        var bgColor = style.backgroundColor;
                        
                        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                            return bgColor;
                        }
                    }
                    
                    // 备选方案：获取 body 背景色
                    return window.getComputedStyle(document.body).backgroundColor;
                })();
            """) { result ->
                try {
                    val colorString = result?.replace("\"", "")
                    val color = parseColorString(colorString)
                    callback(color)
                } catch (e: Exception) {
                    callback(null)
                }
            }
        } catch (e: Exception) {
            callback(null)
        }
    }

    private fun parseColorString(colorString: String?): Int? {
        if (colorString.isNullOrEmpty() || colorString == "null") return null
        
        return try {
            when {
                colorString.startsWith("rgb(") -> {
                    val rgb = colorString.substring(4, colorString.length - 1)
                        .split(",")
                        .map { it.trim().toInt() }
                    Color.rgb(rgb[0], rgb[1], rgb[2])
                }
                colorString.startsWith("rgba(") -> {
                    val rgba = colorString.substring(5, colorString.length - 1)
                        .split(",")
                        .map { it.trim() }
                    val r = rgba[0].toInt()
                    val g = rgba[1].toInt()
                    val b = rgba[2].toInt()
                    val a = (rgba[3].toFloat() * 255).toInt()
                    Color.argb(a, r, g, b)
                }
                colorString.startsWith("#") -> {
                    Color.parseColor(colorString)
                }
                else -> null
            }
        } catch (e: Exception) {
            null
        }
    }

    private fun shouldUpdateColor(newColor: Int): Boolean {
        // 计算颜色差异，避免频繁更新
        val currentRed = Color.red(currentStatusBarColor)
        val currentGreen = Color.green(currentStatusBarColor)
        val currentBlue = Color.blue(currentStatusBarColor)
        
        val newRed = Color.red(newColor)
        val newGreen = Color.green(newColor)
        val newBlue = Color.blue(newColor)
        
        val distance = sqrt(
            ((newRed - currentRed) * (newRed - currentRed) +
             (newGreen - currentGreen) * (newGreen - currentGreen) +
             (newBlue - currentBlue) * (newBlue - currentBlue)).toDouble()
        )
        
        return distance > 30 // 颜色差异阈值
    }

    private fun isColorLight(color: Int): Boolean {
        return ColorUtils.calculateLuminance(color) > 0.5
    }

    private fun animateStatusBarColor(targetColor: Int, lightContent: Boolean) {
        // 取消之前的动画
        colorAnimator.cancel()
        
        colorAnimator.setIntValues(currentStatusBarColor, targetColor)
        colorAnimator.setEvaluator { fraction, startValue, endValue ->
            ColorUtils.blendARGB(startValue as Int, endValue as Int, fraction)
        }
        colorAnimator.duration = 300 // 300ms 动画
        
        colorAnimator.addUpdateListener { animator ->
            val animatedColor = animator.animatedValue as Int
            updateStatusBar(animatedColor, lightContent)
        }
        
        colorAnimator.start()
        
        currentStatusBarColor = targetColor
        isLightStatusBar = lightContent
    }

    private fun updateStatusBar(color: Int, lightContent: Boolean) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.statusBarColor = color
        }
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val decorView = window.decorView
            var flags = decorView.systemUiVisibility
            
            flags = if (lightContent) {
                flags and View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
            } else {
                flags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            }
            
            decorView.systemUiVisibility = flags
        }
    }

    override fun onResume() {
        super.onResume()
        // 恢复颜色检测
        colorDetectionRunnable?.let {
            handler.postDelayed(it, DETECTION_INTERVAL_PLACEHOLDER.toLong())
        }
    }

    override fun onPause() {
        super.onPause()
        // 暂停颜色检测以节省性能
        colorDetectionRunnable?.let {
            handler.removeCallbacks(it)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        colorAnimator.cancel()
    }
}
EOF

# 替换占位符
sed -i "s/PACKAGE_PLACEHOLDER/$PACKAGE_LINE/" "$FILE"
sed -i "s/ENABLE_AUTO_DETECTION_PLACEHOLDER/$ENABLE_AUTO_DETECTION/" "$FILE"
sed -i "s/DETECTION_INTERVAL_PLACEHOLDER/$DETECTION_INTERVAL/g" "$FILE"

echo "✅ MainActivity.kt 已更新为智能版本"