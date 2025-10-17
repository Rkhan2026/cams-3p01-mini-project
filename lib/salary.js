// Utility to extract and normalize salary values from free-form text.
// Returns a number representing annual salary in rupees, or null if none found.
export function parseSalaryFromText(text) {
  if (!text || typeof text !== "string") return null;
  const s = text.replace(/\u00A0/g, " "); // normalize non-breaking spaces

  // 1) ₹ amounts like '₹6,00,000' or 'Rs. 6,00,000'
  const rupeeMatch = s.match(/(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)/i);
  if (rupeeMatch) {
    const raw = rupeeMatch[1].replace(/,/g, "");
    const n = parseFloat(raw);
    if (!isNaN(n)) return n;
  }

  // 2) LPA / Lakh formats like '6 LPA', '6.5 LPA', '6 lakh', '6 lakhs'
  // Match LPA / Lakh patterns, optionally followed by variants like 'per annum', 'pa', or 'p.a.'
  const lpaMatch = s.match(
    /(\d+(?:[.,]\d+)?)\s*(?:lpa|lacs?|lakhs?|l)(?:\s*(?:per annum|pa|p\.a\.))?/i
  );
  if (lpaMatch) {
    const raw = lpaMatch[1].replace(/,/g, ".");
    const n = parseFloat(raw);
    if (!isNaN(n)) return Math.round(n * 100000);
  }

  // 2b) alternate LPA regex (handles uppercase/lowercase and optional words)
  // Alternate, more permissive LPA/lakh matcher
  const lpaMatch2 = s.match(/(\d+(?:[.,]\d+)?)\s*(?:lpa|lakh|lac|lakhs?|l)/i);
  if (lpaMatch2) {
    const raw = lpaMatch2[1].replace(/,/g, ".");
    const n = parseFloat(raw);
    if (!isNaN(n)) return Math.round(n * 100000);
  }

  // 3) Thousand shorthand like '50k' or '50 K'
  const kMatch = s.match(/(\d+(?:[.,]\d+)?)\s*k\b/i);
  if (kMatch) {
    const raw = kMatch[1].replace(/,/g, ".");
    const n = parseFloat(raw);
    if (!isNaN(n)) return Math.round(n * 1000);
  }

  // 4) Plain large numbers with commas or 5+ digits
  const numMatch = s.match(/([\d,]{5,})(?:\b|\s)/);
  if (numMatch) {
    const raw = numMatch[1].replace(/,/g, "");
    const n = parseFloat(raw);
    if (!isNaN(n)) return n;
  }

  // 5) Fallback: any first number (small numbers may be ambiguous)
  const anyNum = s.match(/(\d+(?:[.,]\d+)?)/);
  if (anyNum) {
    const raw = anyNum[1].replace(/,/g, ".");
    const n = parseFloat(raw);
    // if number is reasonably large, take it as rupees; if small (<100), assume LPA
    if (!isNaN(n)) {
      if (n >= 1000) return n; // already rupees
      if (n < 1000 && n > 0) return Math.round(n * 100000); // assume LPA
    }
  }

  return null;
}

// Normalize an input that may already be a numeric string, number, or embedded in text
export function normalizeSalaryInput(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    // try direct numeric
    const cleaned = value.replace(/[,\s₹Rs\.]/gi, "");
    const asNum = parseFloat(cleaned);
    if (!isNaN(asNum) && cleaned.length >= 4) return asNum;
    // else try parsing free text
    return parseSalaryFromText(value);
  }
  return null;
}
