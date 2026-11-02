/**
 * textUtils.ts — Text processing and sanitization utilities
 */

/**
 * Strips internal model reasoning tags (e.g. <thinking>...</thinking> or <thought>...</thought>)
 * to ensure that internal reasoning is never displayed to the user.
 */
export const stripThinkingTags = (text: string): string => {
  return text
    .replace(/<thinking>[\s\S]*?(?:<\/thinking>|$)/gi, '')
    .replace(/<thought>[\s\S]*?(?:<\/thought>|$)/gi, '')
    .trim();
};
