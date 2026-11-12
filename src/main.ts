import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app element not found");

// 1. TYPES — Operator, Calculation, CalcResult
type Operator = "+" | "-" | "*" | "/";
type State = "empty" | "error" | "valid";

type Calculation = {
  valueOne: number;
  valueTwo: number;
  op: Operator;
};

type CalcResult = {
  value: number;
  op: Operator;
};

type Grid = {
  cols: number;
  rows: number;
  ch: string[];
  fg: string[];
};

type Visual = {
  state: State;
  op: Operator | null; // null when no op
  bg: string; // bg color
  field: string; // pattern color
  ink: string; // text color
  text: string; // what to write in the output field
  caption: string;
};

// ++++++++++
// 2. LOGIC — validate(calc): string | null
// ++++++++++
function validate(calc: Calculation): string | null {
  if (Number.isNaN(calc.valueOne) || Number.isNaN(calc.valueTwo)) {
    return "Both values must be numbers.";
  }

  if (calc.op === "/" && calc.valueTwo === 0) {
    return "Division by zero is not allowed.";
  }

  return null; // No validation errors
}

// 2.2 LOGIC - toOperator(), toSymbol()
function toOperator(symbol: string): Operator | null {
  switch (symbol) {
    case "+":
      return "+";
    case "-":
    case "−":
      return "-";
    case "*":
    case "x":
    case "X":
    case "×":
      return "*";
    case "/":
    case "÷":
    case ":":
      return "/";
    default:
      return null;
  }
}

function toSymbol(op: Operator): string {
  switch (op) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "*":
      return "×";
    case "/":
      return "÷";
    default: {
      const check: never = op;
      throw new Error(`Unknown operator: ${check}`);
    }
  }
}

// 2.3 LOGIC - Tokenize expression into Calculation
type Token =
  { kind: "number"; value: number } | { kind: "operator"; value: Operator };

function tokenize(input: string): Token[] | string {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // 1. space -> skip
    if (char === " ") {
      i++;
      continue;
    }

    // 2. digit or "." -> collect the full number
    if ("0123456789.".includes(char)) {
      let numberText = "";
      while (i < input.length && "0123456789.".includes(input[i])) {
        numberText += input[i];
        i++;
      }
      tokens.push({ kind: "number", value: Number(numberText) });
      continue;
    }

    // 3. operator -> toOperator(char), push if not null, else return error
    const op = toOperator(char);
    if (op !== null) {
      tokens.push({ kind: "operator", value: op });
      i++;
      continue;
    }

    // 4. unknown -> return error
    return `Unknown character: ${char}`;
  }

  return tokens;
}

// 3. LOGIC — calculate(calc): CalcResult
function calculate(calc: Calculation): CalcResult {
  switch (calc.op) {
    case "+":
      return { value: calc.valueOne + calc.valueTwo, op: calc.op };
    case "-":
      return { value: calc.valueOne - calc.valueTwo, op: calc.op };
    case "*":
      return { value: calc.valueOne * calc.valueTwo, op: calc.op };
    case "/":
      return { value: calc.valueOne / calc.valueTwo, op: calc.op };
    default: {
      const check: never = calc.op;
      throw new Error(`Unknown operator: ${check}`);
    }
  }
}

// 4. GRID
const CELL_W = 8;
const CELL_H = 16;
const FONT_PX = 12;

const SPACE_X = 6;
const SPACE_Y = 3;

/*-- COLOR THEME --*/
const RED = "#f10505";
const YELLOW = "#fff200";
const BLUE = "#0000ff";
const WHITE = "#ffffff";
const BLACK = "#000000";

const THEME: Record<Operator, { bg: string; field: string; ink: string }> = {
  "+": { bg: RED, field: YELLOW, ink: WHITE },
  "-": { bg: BLUE, field: WHITE, ink: BLACK },
  "*": { bg: YELLOW, field: BLUE, ink: BLACK },
  "/": { bg: WHITE, field: RED, ink: BLACK },
};

const MONO = '"ABC Areal Mono", ui-monospace, monospace';

function createGrid(cols: number, rows: number, fg: string): Grid {
  return {
    cols,
    rows,
    ch: new Array(cols * rows).fill(" "),
    fg: new Array(cols * rows).fill(fg),
  };
}

function setCell(
  grid: Grid,
  x: number,
  y: number,
  ch: string,
  fg: string,
): void {
  if (x < 0 || x >= grid.cols || y < 0 || y >= grid.rows) {
    return; // Out of bounds, do nothing
  }
  const index = y * grid.cols + x;
  grid.ch[index] = ch;
  grid.fg[index] = fg;
}

function fieldSymbol(op: Operator, x: number, y: number): string {
  switch (op) {
    case "+":
      return x % SPACE_X === 0 && y % SPACE_Y === 0 ? "+" : " ";
    case "-":
      return y % SPACE_Y === 0 ? "-" : " ";
    case "*": {
      const row = Math.floor(y / SPACE_Y);
      const shift = row % 2 === 0 ? 0 : Math.floor(SPACE_X / 2);
      return y % SPACE_Y === 0 && (x + shift) % SPACE_X === 0 ? "×" : " ";
    }
    case "/":
      return (x + y) % SPACE_X === 0 ? "/" : " ";

    default: {
      const check: never = op;
      throw new Error(`Unknown operator: ${check}`);
    }
  }
}

function fillField(grid: Grid, op: Operator, color: string): void {
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      const symbol = fieldSymbol(op, x, y);
      if (symbol !== " ") {
        setCell(grid, x, y, symbol, color);
      }
    }
  }
}

function toVisual(
  state: State,
  op: Operator | null,
  text: string,
  caption: string,
): Visual {
  // error
  if (state === "error") {
    return {
      state,
      op: null,
      bg: RED,
      field: BLACK,
      ink: WHITE,
      text,
      caption,
    };
  }
  // valid
  if (state === "valid" && op !== null) {
    const theme = THEME[op];
    return {
      state,
      op,
      bg: theme.bg,
      field: theme.field,
      ink: theme.ink,
      text,
      caption,
    };
  }
  // empty
  return {
    state: "empty",
    op: null,
    bg: WHITE,
    field: BLACK,
    ink: BLUE,
    text: text === "" ? "CALC" : text,
    caption,
  };
}

// ASCII RAMP - light to dark values
const RAMP = " ~≈≋▒";

function inkToSymbol(coverage: number): string {
  const index = Math.round(coverage * (RAMP.length - 1));
  return RAMP[index];
}

//rasterize idea - draw -> invis canvas - read pixels > ink per cell (0-1) - RAMP -> symbols
const DISPLAY = '"ABC Areal", system-ui, sans-serif';
const FIT = 0.85;

function rasterize(text: string, cols: number, rows: number): number[] {
  const empty = new Array(cols * rows).fill(0);
  if (text === "") return empty;

  const width = cols * CELL_W;
  const height = rows * CELL_H;

  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return empty;

  // measure at known size then scale
  octx.font = `100px ${DISPLAY}`;
  const widthAt100 = octx.measureText(text).width;
  const size = Math.min((width * FIT * 100) / widthAt100, height * FIT);

  // draw centered
  octx.font = `${size}px ${DISPLAY}`;
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillStyle = "#000";
  octx.fillText(text, width / 2, height / 2);

  const pixels = octx.getImageData(0, 0, width, height).data;

  const coverage: number[] = [];

  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let sum = 0;
      for (let px = 0; px < CELL_W; px++) {
        for (let py = 0; py < CELL_H; py++) {
          const pixelX = cx * CELL_W + px;
          const pixelY = cy * CELL_H + py;
          sum += pixels[(pixelY * width + pixelX) * 4 + 3];
        }
      }
      coverage.push(sum / (CELL_W * CELL_H * 255));
    }
  }
  return coverage;
}

function stampCoverage(grid: Grid, coverage: number[], color: string): void {
  for (let i = 0; i < coverage.length; i++) {
    const symbol = inkToSymbol(coverage[i]);
    if (symbol !== " ") {
      grid.ch[i] = symbol;
      grid.fg[i] = color;
    }
  }
}

// +++++++++
// 5. DOM — grab elements, null checks
// +++++++++
const expressionInput = document.querySelector<HTMLInputElement>("#expression");
const resultOutput = document.querySelector<HTMLOutputElement>("#result");
const errorParagraph = document.querySelector<HTMLParagraphElement>("#error");

const stage = document.querySelector<HTMLCanvasElement>("#stage");
const ctx = stage?.getContext("2d");

if (!expressionInput || !resultOutput || !errorParagraph || !stage || !ctx) {
  throw new Error("Calculator elements not found in the DOM.");
}

// RENDER
function resizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  return {
    cols: Math.floor(window.innerWidth / CELL_W),
    rows: Math.floor(window.innerHeight / CELL_H),
  };
}

function drawGrid(ctx: CanvasRenderingContext2D, grid: Grid, bg: string): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.font = `${FONT_PX}px ${MONO}`;
  ctx.textBaseline = "top";

  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      const index = y * grid.cols + x;

      if (grid.ch[index] === " ") continue; // Skip empty cells

      ctx.fillStyle = grid.fg[index];
      ctx.fillText(grid.ch[index], x * CELL_W, y * CELL_H);
    }
  }
}

// 6. DOM — on input: read → validate → calculate → show
// Caption: small line, bottom-left. Hint when nothing is calculated yet.
const HINT = "TYPE A SUM — 12 × 4";
const CAPTION_ROWS = 3; // kept free at the bottom for the caption

let visual: Visual = toVisual("empty", null, "", HINT);

const update = (): void => {
  const text = expressionInput.value.trim();

  // empty check -> empty state, stop
  if (text === "") {
    resultOutput.value = "---";
    errorParagraph.textContent = "";
    app.dataset.state = "empty";
    visual = toVisual("empty", null, "", HINT);
    render();
    return;
  }

  const tokens = tokenize(text);
  if (typeof tokens === "string") {
    resultOutput.value = "---";
    errorParagraph.textContent = tokens;
    app.dataset.state = "error";
    visual = toVisual("error", null, tokens, text);
    render();
    return;
  }

  const [first, second, third] = tokens;
  if (
    tokens.length !== 3 ||
    first.kind !== "number" ||
    second.kind !== "operator" ||
    third.kind !== "number"
  ) {
    resultOutput.value = "---";
    errorParagraph.textContent = "";
    app.dataset.state = "empty";
    visual = toVisual("empty", null, text, HINT); // still typing: show it big
    render();
    return;
  }

  // build calc
  const calc: Calculation = {
    valueOne: first.value,
    op: second.value,
    valueTwo: third.value,
  };
  // validate -> error state
  const error = validate(calc);
  if (error !== null) {
    resultOutput.value = "---";
    errorParagraph.textContent = error;
    app.dataset.state = "error";
    visual = toVisual("error", null, error, text);
    render();
    return;
  }

  // calc -> valid state, show result
  const result = calculate(calc);
  resultOutput.value = `${first.value} ${toSymbol(result.op)} ${third.value} = ${result.value}`;
  errorParagraph.textContent = "";
  app.dataset.state = "valid";
  visual = toVisual(
    "valid",
    result.op,
    String(result.value),
    `${first.value} ${toSymbol(result.op)} ${third.value} =`,
  );
  render();
};

expressionInput.addEventListener("input", update);

function writeText(
  grid: Grid,
  x: number,
  y: number,
  text: string,
  color: string,
): void {
  for (let i = 0; i < text.length; i++) {
    setCell(grid, x + i, y, text[i], color);
  }
}

// Blank one row so text on it reads against the field pattern.
function clearRow(grid: Grid, y: number): void {
  for (let x = 0; x < grid.cols; x++) {
    setCell(grid, x, y, " ", grid.fg[0]);
  }
}

const render = (): void => {
  const size = resizeCanvas(stage, ctx);
  const grid = createGrid(size.cols, size.rows, visual.ink);

  if (visual.op !== null) {
    fillField(grid, visual.op, visual.field);
  }

  if (visual.state === "error") {
    const x = Math.floor((grid.cols - visual.text.length) / 2);
    const y = Math.floor(grid.rows / 2);
    writeText(grid, x, y, visual.text, visual.ink);
  } else {
    stampCoverage(
      grid,
      rasterize(visual.text, grid.cols, grid.rows - CAPTION_ROWS),
      visual.ink,
    );
  }

  // caption: one clean row near the bottom, 2 cells from the left edge
  const captionY = grid.rows - 2;
  clearRow(grid, captionY);
  writeText(grid, 2, captionY, visual.caption, visual.ink);

  drawGrid(ctx, grid, visual.bg);
};

window.addEventListener("resize", render);

// 7. DOM — initial update
update();
document.fonts.ready.then(render);

document.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  expressionInput.focus();
});
