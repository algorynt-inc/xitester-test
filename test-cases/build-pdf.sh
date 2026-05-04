#!/usr/bin/env bash
# Convert XiTester test-case Markdown files to styled PDFs.
#
# Pipeline: pandoc (gfm → standalone HTML with embedded CSS) → Chrome headless --print-to-pdf.
# Inputs : optional list of *.md filenames, relative to test-cases/. If none given,
#          builds every *.md in test-cases/ except PATTERN.md and README*.
# Outputs: test-cases/build/<name>.html and test-cases/build/<name>.pdf
#
# Usage:
#   bash test-cases/build-pdf.sh                  # build all
#   bash test-cases/build-pdf.sh signup.md        # build one
#   bash test-cases/build-pdf.sh login.md signup.md

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cd "$SCRIPT_DIR"

CSS_PATH="styles/test-case.css"
BUILD_DIR="build"
mkdir -p "$BUILD_DIR"

# ---- locate dependencies -------------------------------------------------

if ! command -v pandoc > /dev/null 2>&1; then
    echo "ERROR: pandoc not found in PATH. Install with: brew install pandoc" >&2
    exit 1
fi

CHROME=""
for candidate in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "$(command -v google-chrome 2> /dev/null || true)" \
    "$(command -v chromium 2> /dev/null || true)"; do
    if [[ -n "$candidate" && -x "$candidate" ]]; then
        CHROME="$candidate"
        break
    fi
done

if [[ -z "$CHROME" ]]; then
    echo "ERROR: Chrome/Chromium not found. Install Google Chrome from https://www.google.com/chrome/" >&2
    exit 1
fi

if [[ ! -f "$CSS_PATH" ]]; then
    echo "ERROR: missing stylesheet at $CSS_PATH" >&2
    exit 1
fi

# ---- collect inputs ------------------------------------------------------

declare -a INPUTS=()
if [[ $# -gt 0 ]]; then
    INPUTS=("$@")
else
    while IFS= read -r f; do
        INPUTS+=("$(basename "$f")")
    done < <(find . -maxdepth 1 -type f -name "*.md" \
        ! -name "PATTERN.md" ! -name "README*" | sort)
fi

if [[ ${#INPUTS[@]} -eq 0 ]]; then
    echo "No Markdown test-case files found in $SCRIPT_DIR." >&2
    exit 1
fi

# ---- build loop ----------------------------------------------------------

declare -a PRODUCED=()

for md in "${INPUTS[@]}"; do
    if [[ ! -f "$md" ]]; then
        echo "skip: $md (not found)" >&2
        continue
    fi

    base="${md%.md}"
    html_out="$BUILD_DIR/$base.html"
    pdf_out="$BUILD_DIR/$base.pdf"

    # Pull title from first H1 line (strip leading "# "); fall back to filename.
    title="$(head -n1 "$md" | sed -E 's/^# *//')"
    if [[ -z "$title" ]]; then
        title="$base"
    fi
    today="$(date +%Y-%m-%d)"

    echo "→ pandoc: $md → $html_out"
    pandoc "$md" \
        --standalone \
        --from=gfm \
        --to=html5 \
        --metadata title="$title" \
        --metadata date="$today" \
        --css="$CSS_PATH" \
        --embed-resources \
        --output="$html_out"

    echo "→ chrome: $html_out → $pdf_out"
    "$CHROME" \
        --headless=new \
        --disable-gpu \
        --no-pdf-header-footer \
        --print-to-pdf="$pdf_out" \
        --print-to-pdf-no-header \
        "file://$SCRIPT_DIR/$html_out" > /dev/null 2>&1

    if [[ ! -s "$pdf_out" ]]; then
        echo "ERROR: $pdf_out was not produced or is empty" >&2
        exit 1
    fi

    PRODUCED+=("$pdf_out")
done

# ---- summary -------------------------------------------------------------

echo
echo "Built ${#PRODUCED[@]} PDF(s):"
for p in "${PRODUCED[@]}"; do
    size="$(du -h "$p" | cut -f1)"
    echo "  $size  $SCRIPT_DIR/$p"
done
