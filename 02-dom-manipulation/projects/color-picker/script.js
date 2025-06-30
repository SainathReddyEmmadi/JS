// Color Picker Application
class ColorPicker {
  constructor() {
    // Current color state
    this.currentColor = {
      r: 255,
      g: 0,
      b: 0,
      h: 0,
      s: 100,
      l: 50
    };

    // Preset colors
    this.presetColors = [
      "#FF0000",
      "#FF8000",
      "#FFFF00",
      "#80FF00",
      "#00FF00",
      "#00FF80",
      "#00FFFF",
      "#0080FF",
      "#0000FF",
      "#8000FF",
      "#FF00FF",
      "#FF0080",
      "#FFFFFF",
      "#C0C0C0",
      "#808080",
      "#404040",
      "#000000"
    ];

    // Saved palette
    this.savedPalette = this.loadPalette();

    // Initialize the application
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.generatePresetColors();
    this.renderSavedPalette();
    this.updateDisplay();
  }

  setupEventListeners() {
    // RGB Sliders
    this.setupSliderPair("red", "r", 0, 255);
    this.setupSliderPair("green", "g", 0, 255);
    this.setupSliderPair("blue", "b", 0, 255);

    // HSL Sliders
    this.setupSliderPair("hue", "h", 0, 360);
    this.setupSliderPair("saturation", "s", 0, 100);
    this.setupSliderPair("lightness", "l", 0, 100);

    // Copy buttons
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.copyColorValue(e.target.dataset.format)
      );
    });

    // Palette actions
    document
      .getElementById("save-color")
      .addEventListener("click", () => this.saveCurrentColor());
    document
      .getElementById("clear-palette")
      .addEventListener("click", () => this.clearPalette());
    document
      .getElementById("export-palette")
      .addEventListener("click", () => this.exportPalette());
    document
      .getElementById("add-preset")
      .addEventListener("click", () => this.addPresetColor());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) =>
      this.handleKeyboardShortcuts(e)
    );
  }

  setupSliderPair(name, property, min, max) {
    const slider = document.getElementById(`${name}-slider`);
    const input = document.getElementById(`${name}-input`);

    // Slider change
    slider.addEventListener("input", (e) => {
      const value = parseFloat(e.target.value);
      this.currentColor[property] = value;
      input.value = value;

      if (["r", "g", "b"].includes(property)) {
        this.updateHSLFromRGB();
      } else {
        this.updateRGBFromHSL();
      }

      this.updateDisplay();
    });

    // Number input change
    input.addEventListener("input", (e) => {
      let value = parseFloat(e.target.value);

      // Validate range
      if (value < min) value = min;
      if (value > max) value = max;

      this.currentColor[property] = value;
      slider.value = value;

      if (["r", "g", "b"].includes(property)) {
        this.updateHSLFromRGB();
      } else {
        this.updateRGBFromHSL();
      }

      this.updateDisplay();
    });

    // Number input blur - ensure valid value
    input.addEventListener("blur", (e) => {
      let value = parseFloat(e.target.value);
      if (isNaN(value) || value < min || value > max) {
        e.target.value = this.currentColor[property];
      }
    });
  }

  updateRGBFromHSL() {
    const { h, s, l } = this.currentColor;
    const rgb = this.hslToRgb(h, s / 100, l / 100);

    this.currentColor.r = Math.round(rgb.r);
    this.currentColor.g = Math.round(rgb.g);
    this.currentColor.b = Math.round(rgb.b);

    // Update RGB controls
    document.getElementById("red-slider").value = this.currentColor.r;
    document.getElementById("red-input").value = this.currentColor.r;
    document.getElementById("green-slider").value = this.currentColor.g;
    document.getElementById("green-input").value = this.currentColor.g;
    document.getElementById("blue-slider").value = this.currentColor.b;
    document.getElementById("blue-input").value = this.currentColor.b;
  }

  updateHSLFromRGB() {
    const { r, g, b } = this.currentColor;
    const hsl = this.rgbToHsl(r, g, b);

    this.currentColor.h = Math.round(hsl.h);
    this.currentColor.s = Math.round(hsl.s * 100);
    this.currentColor.l = Math.round(hsl.l * 100);

    // Update HSL controls
    document.getElementById("hue-slider").value = this.currentColor.h;
    document.getElementById("hue-input").value = this.currentColor.h;
    document.getElementById("saturation-slider").value = this.currentColor.s;
    document.getElementById("saturation-input").value = this.currentColor.s;
    document.getElementById("lightness-slider").value = this.currentColor.l;
    document.getElementById("lightness-input").value = this.currentColor.l;
  }

  updateDisplay() {
    const { r, g, b, h, s, l } = this.currentColor;

    // Update preview box
    const previewBox = document.getElementById("color-preview");
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    previewBox.style.backgroundColor = rgbColor;

    // Update color value displays
    document.getElementById("hex-value").value = this.rgbToHex(r, g, b);
    document.getElementById("rgb-value").value = `rgb(${r}, ${g}, ${b})`;
    document.getElementById("hsl-value").value = `hsl(${h}, ${s}%, ${l}%)`;

    // Update slider backgrounds for visual feedback
    this.updateSliderBackgrounds();
  }

  updateSliderBackgrounds() {
    const { r, g, b, h, s, l } = this.currentColor;

    // RGB slider backgrounds
    document.getElementById(
      "red-slider"
    ).style.background = `linear-gradient(to right, rgb(0,${g},${b}), rgb(255,${g},${b}))`;
    document.getElementById(
      "green-slider"
    ).style.background = `linear-gradient(to right, rgb(${r},0,${b}), rgb(${r},255,${b}))`;
    document.getElementById(
      "blue-slider"
    ).style.background = `linear-gradient(to right, rgb(${r},${g},0), rgb(${r},${g},255))`;

    // HSL slider backgrounds
    document.getElementById("hue-slider").style.background =
      "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";
    document.getElementById(
      "saturation-slider"
    ).style.background = `linear-gradient(to right, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))`;
    document.getElementById(
      "lightness-slider"
    ).style.background = `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`;
  }

  generatePresetColors() {
    const presetGrid = document.getElementById("preset-grid");
    presetGrid.innerHTML = "";

    this.presetColors.forEach((color) => {
      const swatch = document.createElement("div");
      swatch.className = "preset-swatch";
      swatch.style.backgroundColor = color;
      swatch.title = color;
      swatch.tabIndex = 0;
      swatch.setAttribute("role", "button");
      swatch.setAttribute("aria-label", `Select color ${color}`);

      swatch.addEventListener("click", () => this.selectPresetColor(color));
      swatch.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectPresetColor(color);
        }
      });

      presetGrid.appendChild(swatch);
    });
  }

  selectPresetColor(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (rgb) {
      this.currentColor.r = rgb.r;
      this.currentColor.g = rgb.g;
      this.currentColor.b = rgb.b;

      this.updateHSLFromRGB();
      this.updateAllControls();
      this.updateDisplay();

      // Visual feedback
      this.highlightSelectedPreset(hexColor);
      this.showToast(`Selected color: ${hexColor}`, "success");
    }
  }

  highlightSelectedPreset(hexColor) {
    document.querySelectorAll(".preset-swatch").forEach((swatch) => {
      swatch.classList.remove("selected");
      if (swatch.title === hexColor.toUpperCase()) {
        swatch.classList.add("selected");
      }
    });
  }

  updateAllControls() {
    const { r, g, b, h, s, l } = this.currentColor;

    // Update RGB controls
    document.getElementById("red-slider").value = r;
    document.getElementById("red-input").value = r;
    document.getElementById("green-slider").value = g;
    document.getElementById("green-input").value = g;
    document.getElementById("blue-slider").value = b;
    document.getElementById("blue-input").value = b;

    // Update HSL controls
    document.getElementById("hue-slider").value = h;
    document.getElementById("hue-input").value = h;
    document.getElementById("saturation-slider").value = s;
    document.getElementById("saturation-input").value = s;
    document.getElementById("lightness-slider").value = l;
    document.getElementById("lightness-input").value = l;
  }

  saveCurrentColor() {
    const hexColor = this.rgbToHex(
      this.currentColor.r,
      this.currentColor.g,
      this.currentColor.b
    );

    // Check if color already exists
    if (this.savedPalette.includes(hexColor)) {
      this.showToast("Color already in palette!", "warning");
      return;
    }

    this.savedPalette.push(hexColor);
    this.savePalette();
    this.renderSavedPalette();
    this.showToast(`Color ${hexColor} saved to palette!`, "success");
  }

  renderSavedPalette() {
    const paletteGrid = document.getElementById("palette-grid");
    paletteGrid.innerHTML = "";

    if (this.savedPalette.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent =
        "No colors saved yet. Save your current color to start building your palette!";
      emptyMessage.style.textAlign = "center";
      emptyMessage.style.color = "#6c757d";
      emptyMessage.style.fontStyle = "italic";
      paletteGrid.appendChild(emptyMessage);
      return;
    }

    this.savedPalette.forEach((color, index) => {
      const swatch = document.createElement("div");
      swatch.className = "palette-swatch";
      swatch.style.backgroundColor = color;
      swatch.title = color;
      swatch.tabIndex = 0;
      swatch.setAttribute("role", "button");
      swatch.setAttribute(
        "aria-label",
        `Select saved color ${color}, or delete`
      );

      // Click to select color
      swatch.addEventListener("click", (e) => {
        // Check if clicking on delete button
        if (e.target === swatch && !e.target.matches("::after")) {
          this.selectPresetColor(color);
        }
      });

      // Delete functionality
      swatch.addEventListener("click", (e) => {
        if (e.offsetX > swatch.offsetWidth - 25 && e.offsetY < 25) {
          this.removeSavedColor(index);
        }
      });

      // Keyboard support
      swatch.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectPresetColor(color);
        } else if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          this.removeSavedColor(index);
        }
      });

      paletteGrid.appendChild(swatch);
    });
  }

  removeSavedColor(index) {
    const removedColor = this.savedPalette[index];
    this.savedPalette.splice(index, 1);
    this.savePalette();
    this.renderSavedPalette();
    this.showToast(`Removed ${removedColor} from palette`, "success");
  }

  clearPalette() {
    if (this.savedPalette.length === 0) {
      this.showToast("Palette is already empty!", "warning");
      return;
    }

    if (confirm("Are you sure you want to clear all saved colors?")) {
      this.savedPalette = [];
      this.savePalette();
      this.renderSavedPalette();
      this.showToast("Palette cleared!", "success");
    }
  }

  exportPalette() {
    if (this.savedPalette.length === 0) {
      this.showToast("No colors to export!", "warning");
      return;
    }

    const paletteData = {
      name: "My Color Palette",
      colors: this.savedPalette,
      exported: new Date().toISOString()
    };

    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = "color-palette.json";
    link.click();

    this.showToast("Palette exported successfully!", "success");
  }

  addPresetColor() {
    const hexColor = this.rgbToHex(
      this.currentColor.r,
      this.currentColor.g,
      this.currentColor.b
    );

    if (this.presetColors.includes(hexColor)) {
      this.showToast("Color already in presets!", "warning");
      return;
    }

    this.presetColors.push(hexColor);
    this.generatePresetColors();
    this.showToast(`Added ${hexColor} to presets!`, "success");
  }

  copyColorValue(format) {
    let value;
    const { r, g, b, h, s, l } = this.currentColor;

    switch (format) {
      case "hex":
        value = this.rgbToHex(r, g, b);
        break;
      case "rgb":
        value = `rgb(${r}, ${g}, ${b})`;
        break;
      case "hsl":
        value = `hsl(${h}, ${s}%, ${l}%)`;
        break;
      default:
        return;
    }

    // Use modern clipboard API if available
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          this.showToast(`Copied ${value} to clipboard!`, "success");
        })
        .catch(() => {
          this.fallbackCopyTextToClipboard(value);
        });
    } else {
      this.fallbackCopyTextToClipboard(value);
    }
  }

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      this.showToast(`Copied ${text} to clipboard!`, "success");
    } catch (err) {
      this.showToast("Failed to copy to clipboard", "error");
    }

    document.body.removeChild(textArea);
  }

  handleKeyboardShortcuts(e) {
    // Only handle shortcuts when not in input fields
    if (e.target.tagName.toLowerCase() === "input") return;

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault();
          this.saveCurrentColor();
          break;
        case "c":
          e.preventDefault();
          this.copyColorValue("hex");
          break;
        case "e":
          e.preventDefault();
          this.exportPalette();
          break;
      }
    }

    // Arrow key navigation for fine-tuning
    if (e.target.classList.contains("color-slider")) {
      const step = e.shiftKey ? 10 : 1;
      let currentValue = parseFloat(e.target.value);
      let newValue = currentValue;

      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight":
          e.preventDefault();
          newValue = Math.min(parseFloat(e.target.max), currentValue + step);
          break;
        case "ArrowDown":
        case "ArrowLeft":
          e.preventDefault();
          newValue = Math.max(parseFloat(e.target.min), currentValue - step);
          break;
      }

      if (newValue !== currentValue) {
        e.target.value = newValue;
        e.target.dispatchEvent(new Event("input"));
      }
    }
  }

  showToast(message, type = "success", duration = 3000) {
    const toastContainer = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // Color conversion utilities
  rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
        .toUpperCase()
    );
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s, l: l };
  }

  hslToRgb(h, s, l) {
    h /= 360;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
  }

  // Local storage utilities
  savePalette() {
    try {
      localStorage.setItem(
        "colorPickerPalette",
        JSON.stringify(this.savedPalette)
      );
    } catch (e) {
      console.warn("Could not save palette to localStorage:", e);
    }
  }

  loadPalette() {
    try {
      const saved = localStorage.getItem("colorPickerPalette");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Could not load palette from localStorage:", e);
      return [];
    }
  }
}

// Initialize the color picker when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ColorPicker();
});

// Add some helpful utilities to the global scope for debugging
window.ColorPickerUtils = {
  rgbToHex: (r, g, b) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase(),

  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }
};
