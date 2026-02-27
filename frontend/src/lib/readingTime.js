// src/lib/readingTime.js

function stripHtml(html = "") {
    return String(html).replace(/<[^>]*>/g, " ");
  }
  
  function countWords(text = "") {
    const words = String(text).trim().match(/\S+/g);
    return words ? words.length : 0;
  }
  
  function extractTextFromBlocks(blocks) {
    if (!Array.isArray(blocks)) return "";
  
    // Intentamos sacar texto de los campos más típicos en Strapi blocks
    return blocks
      .map((b) => {
        if (!b || typeof b !== "object") return "";
  
        // Rich text suele venir como HTML en "body" o "content"
        if (typeof b.body === "string") return stripHtml(b.body);
        if (typeof b.content === "string") return stripHtml(b.content);
        if (typeof b.text === "string") return stripHtml(b.text);
  
        // Si no sabemos la forma exacta, convertimos a string y quitamos HTML
        return stripHtml(JSON.stringify(b));
      })
      .join(" ");
  }
  
  export function getReadingTimeMinutes({ content, blocks } = {}) {
    const text = content
      ? stripHtml(content)
      : extractTextFromBlocks(blocks);
  
    const words = countWords(text);
    const minutes = Math.max(1, Math.ceil(words / 200));
    return minutes;
  }