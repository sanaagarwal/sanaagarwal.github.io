// openrouter.js
// chat(prompt) using OpenRouter. This is the chat() we wrote in class.
// One change: it reads your key from the key box on the page by itself,
// so every example can call chat(prompt) the same way.

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-3.5-super-vl:free";

async function chat(prompt) {
    // Paste your key in the box on the page. Never type it into your code: your site is on GitHub.
    const key = document.querySelector("#key").value.trim();

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [{ role: "user", content: prompt }],
        }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || response.statusText);
    return data.choices[0].message.content;
}