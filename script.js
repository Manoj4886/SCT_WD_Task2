document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const buttons = document.querySelectorAll(".buttons button");
  const themeToggle = document.getElementById("theme-toggle");
  const historyList = document.getElementById("history-list");
  const clearHistoryBtn = document.getElementById("clear-history");
  const memoryClearBtn = document.getElementById("memory-clear");
  const memoryStatus = document.getElementById("memory-status");
  
  let memory = 0;
  let lastCalculation = "";

  // Button Clicks
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.textContent;
      const func = btn.dataset.func;

      if (func) {
        handleFunction(func);
      } else if (value === "=") {
        calculate();
      } else if (value === "C") {
        display.value = "";
      } else if (value === "⌫") {
        display.value = display.value.slice(0, -1);
      } else {
        display.value += value;
      }
    });
  });

  // Function Handler
  function handleFunction(func) {
    const currentValue = parseFloat(display.value) || 0;
    
    switch(func) {
      case "sqrt":
        if (currentValue >= 0) {
          display.value = Math.sqrt(currentValue);
          addToHistory(`√${currentValue} = ${Math.sqrt(currentValue)}`);
        } else {
          display.value = "Error";
        }
        break;
      case "square":
        display.value = currentValue * currentValue;
        addToHistory(`${currentValue}² = ${currentValue * currentValue}`);
        break;
      case "power":
        display.value += "^";
        break;
      case "pi":
        display.value = Math.PI;
        break;
      case "percent":
        display.value = currentValue / 100;
        addToHistory(`${currentValue}% = ${currentValue / 100}`);
        break;
      case "memory-add":
        memory += parseFloat(display.value) || 0;
        updateMemoryStatus();
        break;
      case "memory-recall":
        display.value = memory;
        break;
      case "factorial":
        if (currentValue >= 0 && Number.isInteger(currentValue)) {
          display.value = factorial(currentValue);
          addToHistory(`${currentValue}! = ${factorial(currentValue)}`);
        } else {
          display.value = "Error";
        }
        break;
    }
  }

  // Factorial Function
  function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // Update Memory Status
  function updateMemoryStatus() {
    memoryStatus.textContent = `Memory: ${memory}`;
  }

  // Calculate Function
  function calculate() {
    try {
      let expression = display.value.trim();
      if (!expression) return;

      // Handle power operator
      expression = expression.replace(/\^/g, "**");
      
      const result = eval(expression);
      if (!isFinite(result)) throw Error("Invalid");
      display.value = result;

      addToHistory(expression + " = " + result);
      lastCalculation = expression + " = " + result;
    } catch (err) {
      display.value = "Error";
    }
  }

  // History Functions
  function addToHistory(entry) {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.prepend(li);
  }

  clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
  });

  // Memory Clear
  memoryClearBtn.addEventListener("click", () => {
    memory = 0;
    updateMemoryStatus();
  });

  // Keyboard Input
  document.addEventListener("keydown", e => {
    if (/[0-9+\-*/().]/.test(e.key)) {
      display.value += e.key;
    } else if (e.key === "Enter") {
      calculate();
    } else if (e.key === "Backspace") {
      display.value = display.value.slice(0, -1);
    } else if (e.key === "Escape") {
      display.value = "";
    } else if (e.key === "^") {
      display.value += "^";
    }
  });

  // Theme Toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "☀" : "🌙";
  });
});
