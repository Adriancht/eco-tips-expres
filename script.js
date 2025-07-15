// script.js

// Función asíncrona para interactuar con la API de Gemini
async function getGeminiResponse(prompt) {
  const apiKey = "AIzaSyDn4M1_xi9SaJLF1V1ZRwrzZdwdgOrYg-Q";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Actúa como un experto en sostenibilidad. Si te preguntan algo como: '${prompt}', responde con un consejo ecológico directo, corto y útil en español.`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la llamada a la API de Gemini:", response.status, errorData);
      return `Lo siento, hubo un error al obtener el consejo. Código: ${response.status}`;
    }

    const result = await response.json();

    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      return "No pude obtener un consejo. La respuesta de la API no tiene el formato esperado.";
    }
  } catch (error) {
    console.error("Error al conectar con la API de Gemini:", error);
    return "Hubo un problema de conexión. Por favor, inténtalo de nuevo más tarde.";
  }
}

// DOM Elements
const userInput = document.getElementById("user-input");
const getTipButton = document.getElementById("get-tip-button");
const resultsDiv = document.getElementById("results");

// Manejador de clic en el botón
getTipButton.addEventListener("click", async () => {
  const prompt = userInput.value.trim();

  if (prompt) {
    resultsDiv.innerHTML = '<p class="text-gray-400">Generando EcoTip...</p>';
    const tip = await getGeminiResponse(prompt);
    resultsDiv.innerHTML = `<p class="text-green-800 font-semibold">${tip}</p>`;
    userInput.value = "";
  } else {
    resultsDiv.innerHTML = '<p class="text-red-400">Por favor, escribe tu pregunta para un EcoTip.</p>';
  }
});

// Enviar con Enter
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
