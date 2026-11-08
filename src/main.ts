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
console.log(validate({ valueOne: NaN, valueTwo: 5, op: "+" }));
console.log(validate({ valueOne: 10, valueTwo: 0, op: "/" }));
console.log(calculate({ valueOne: 10, valueTwo: 5, op: "/" })); // 2
console.log(calculate({ valueOne: 6, valueTwo: 5, op: "+" })); // 11
console.log(calculate({ valueOne: 6, valueTwo: 5, op: "-" })); // 1
console.log(calculate({ valueOne: 6, valueTwo: 5, op: "*" })); // 30

// 5. DOM — grab elements, null checks
const valueOneInput = document.querySelector<HTMLInputElement>("#valueOne");
const valueTwoInput = document.querySelector<HTMLInputElement>("#valueTwo");
const operatorSelect = document.querySelector<HTMLSelectElement>("#operator");
const resultOutput = document.querySelector<HTMLOutputElement>("#result");
const errorParagraph = document.querySelector<HTMLParagraphElement>("#error");

if (
  !valueOneInput ||
  !valueTwoInput ||
  !operatorSelect ||
  !resultOutput ||
  !errorParagraph
) {
  throw new Error("Calculator elements not found in the DOM.");
}

// 6. DOM — on input: read → validate → calculate → show
const update = (): void => {
  // read (valueOneInput.value is always a string, even with type="number")
  const valueOne = Number(valueOneInput.value);
  const valueTwo = Number(valueTwoInput.value);
  const op = operatorSelect.value as Operator;

  // empty check -> empty state, stop (if either .value is "" set empty state, put --- in output, clear error text and return to stop)
  if (valueOneInput.value === "" || valueTwoInput.value === "") {
    resultOutput.value = "---";
    errorParagraph.textContent = "";
    app.dataset.state = "empty";
    return;
  }

  // build calc (convert with number(valueOneInput.value)... op: operatorSelect.value as Operator
  const calc: Calculation = { valueOne, valueTwo, op };
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
  resultOutput.value = `${valueOne} ${result.op} ${valueTwo} = ${result.value}`;
  errorParagraph.textContent = "";
  app.dataset.state = "valid";
};

valueOneInput.addEventListener("input", update);
valueTwoInput.addEventListener("input", update);
operatorSelect.addEventListener("change", update);

// 7. DOM — initial update
update();
