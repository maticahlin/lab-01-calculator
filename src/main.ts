import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app element not found");

// 1. TYPES — Operator, Calculation, CalcResult
type Operator = "+" | "-" | "*" | "/";

type Calculation = {
  valueOne: number;
  valueTwo: number;
  op: Operator;
};

type CalcResult = {
  value: number;
  op: Operator;
};

// 2. LOGIC — validate(calc): string | null
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
    default:
      const check: never = op;
      throw new Error(`Unknown operator: ${check}`);
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
    default:
      const check: never = calc.op;
      throw new Error(`Unknown operator: ${check}`);
  }
}

// 4. TESTS — console.log a few cases (delete later)

// 5. DOM — grab elements, null checks
const expressionInput = document.querySelector<HTMLInputElement>("#expression");
const resultOutput = document.querySelector<HTMLOutputElement>("#result");
const errorParagraph = document.querySelector<HTMLParagraphElement>("#error");

if (!expressionInput || !resultOutput || !errorParagraph) {
  throw new Error("Calculator elements not found in the DOM.");
}

// 6. DOM — on input: read → validate → calculate → show
const update = (): void => {
  const text = expressionInput.value.trim();

  // empty check -> empty state, stop
  if (text === "") {
    resultOutput.value = "---";
    errorParagraph.textContent = "";
    app.dataset.state = "empty";
    return;
  }

  const tokens = tokenize(text);
  if (typeof tokens === "string") {
    resultOutput.value = "---";
    errorParagraph.textContent = tokens;
    app.dataset.state = "error";
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
    errorParagraph.textContent =
      "Expression must be in the form: number operator number.";
    app.dataset.state = "error";
    return;
  }

  // build calc
  const calc: Calculation = {
    valueOne: first.value,
    op: second.value,
    valueTwo: third.value,
  };
  // validate -> error state, stop (const error = validate(calc)
  const error = validate(calc);
  if (error !== null) {
    resultOutput.value = "---";
    errorParagraph.textContent = error;
    app.dataset.state = "error";
    return;
  }

  // calc -> valid state, show result
  const result = calculate(calc);
  resultOutput.value = `${first.value} ${toSymbol(result.op)} ${third.value} = ${result.value}`;
  errorParagraph.textContent = "";
  app.dataset.state = "valid";
};

expressionInput.addEventListener("input", update);

// 7. DOM — initial update
update();
