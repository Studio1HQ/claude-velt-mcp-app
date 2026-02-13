import { App } from "@modelcontextprotocol/ext-apps";

const app = new App({ name: "Test App", version: "1.0.0" });

// Connect to Claude
app.connect().then(() => {
  console.log("Connected to Claude!");
});

// Simple button click
document.getElementById("test-btn")?.addEventListener("click", () => {
  const output = document.getElementById("output");
  if (output) {
    output.textContent = "Button clicked! App is working ✅";
  }
});
