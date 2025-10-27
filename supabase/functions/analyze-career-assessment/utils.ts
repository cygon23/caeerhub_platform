export interface Question {
  id: number;
  question: string;
  category: string;
  subcategory: string;
  weight: number;
  responseType: string;
  context?: string;
}

export interface Responses {
  [questionId: number]: number;
}

// ============================================
// CALCULATE CATEGORY SCORES
// ============================================

export function calculateCategoryScores(
  questions: Question[],
  responses: Responses
) {
  const subcategoryData: Record<
    string,
    { total: number; weight: number; count: number }
  > = {};

  // Aggregate scores by subcategory
  questions.forEach((q) => {
    const response = responses[q.id] || 0;
    const weightedScore = response * q.weight;

    if (!subcategoryData[q.subcategory]) {
      subcategoryData[q.subcategory] = { total: 0, weight: 0, count: 0 };
    }

    subcategoryData[q.subcategory].total += weightedScore;
    subcategoryData[q.subcategory].weight += q.weight;
    subcategoryData[q.subcategory].count += 1;
  });

  // Calculate weighted averages (convert to 0-100 scale)
  const categoryScores: Record<string, number> = {};

  Object.keys(subcategoryData).forEach((subcategory) => {
    const data = subcategoryData[subcategory];
    // Calculate average response (1-5) then convert to percentage
    const avgResponse = data.total / data.weight;
    categoryScores[subcategory] = Math.round((avgResponse / 5) * 100);
  });

  return categoryScores;
}

// ============================================
// VALIDATE RESPONSES
// ============================================

export function validateResponses(
  questions: Question[],
  responses: Responses
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check all questions are answered
  questions.forEach((q) => {
    if (responses[q.id] === undefined) {
      errors.push(`Question ${q.id} not answered`);
    } else if (responses[q.id] < 1 || responses[q.id] > 5) {
      errors.push(`Question ${q.id} has invalid response: ${responses[q.id]}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// GET RESPONSE PATTERNS
// ============================================

export function getResponsePatterns(
  questions: Question[],
  responses: Responses
) {
  const patterns = {
    highScores: [] as Question[],
    lowScores: [] as Question[],
    neutralScores: [] as Question[],
    consistencyScore: 0,
  };

  questions.forEach((q) => {
    const response = responses[q.id];
    if (response >= 4) {
      patterns.highScores.push(q);
    } else if (response <= 2) {
      patterns.lowScores.push(q);
    } else {
      patterns.neutralScores.push(q);
    }
  });

  // Calculate consistency (low variance = high consistency)
  const values = Object.values(responses);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  // Convert to 0-100 scale (lower stdDev = higher consistency)
  patterns.consistencyScore = Math.round(Math.max(0, 100 - stdDev * 30));

  return patterns;
}

// ============================================
// GENERATE MILESTONE DATES
// ============================================

export function generateMilestoneDates(
  timeline: string,
  count: number = 3
): string[] {
  const months = timeline.includes("3") ? 3 : timeline.includes("6") ? 6 : 12;
  const intervalMonths = Math.floor(months / count);

  const dates: string[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const milestoneDate = new Date(now);
    milestoneDate.setMonth(now.getMonth() + intervalMonths * i);
    dates.push(milestoneDate.toISOString().split("T")[0]);
  }

  return dates;
}

// ============================================
// FORMAT EVIDENCE FROM RESPONSES
// ============================================

export function formatEvidence(
  questions: Question[],
  responses: Responses,
  targetSubcategories: string[]
): string[] {
  const evidence: string[] = [];

  questions.forEach((q) => {
    if (targetSubcategories.includes(q.subcategory)) {
      const response = responses[q.id];
      if (response >= 4) {
        evidence.push(
          `Strong agreement on "${q.question}" (Q${q.id}: ${response}/5)`
        );
      } else if (response <= 2) {
        evidence.push(`Low score on "${q.question}" (Q${q.id}: ${response}/5)`);
      }
    }
  });

  return evidence.slice(0, 3); // Limit to top 3 pieces of evidence
}

// ============================================
// CATEGORIZE BY MAIN CATEGORY
// ============================================

export function groupByMainCategory(questions: Question[]) {
  const grouped: Record<string, Question[]> = {};

  questions.forEach((q) => {
    if (!grouped[q.category]) {
      grouped[q.category] = [];
    }
    grouped[q.category].push(q);
  });

  return grouped;
}

// ============================================
// IDENTIFY STRENGTHS CATEGORIES
// ============================================

export function identifyTopCategories(
  categoryScores: Record<string, number>,
  count: number = 5
): Array<{ category: string; score: number }> {
  return Object.entries(categoryScores)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// ============================================
// IDENTIFY WEAKNESS CATEGORIES
// ============================================

export function identifyBottomCategories(
  categoryScores: Record<string, number>,
  count: number = 4
): Array<{ category: string; score: number }> {
  return Object.entries(categoryScores)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

// ============================================
// CLEAN TEXT FOR JSON
// ============================================

export function cleanTextForJSON(text: string): string {
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
    .replace(/\\/g, "\\\\") // Escape backslashes
    .replace(/"/g, '\\"') // Escape quotes
    .trim();
}

// ============================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Max retries exceeded");
}

// ============================================
// TRUNCATE TEXT
// ============================================

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}

// ============================================
// SAFE JSON STRINGIFY
// ============================================

export function safeJSONStringify(obj: any, maxDepth: number = 10): string {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    },
    2
  );
}
