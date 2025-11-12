import { MatchType } from "@/generated/prisma";

export default function checkMatch(
  input: string,
  expected: string,
  matchType: MatchType
): boolean {
  switch (matchType) {
    case "EXACT":
      return input.trim() === expected.trim();
    case "CASE_INSENSITIVE":
      return input.trim().toLowerCase() === expected.trim().toLowerCase();
    case "CONTAINS":
      return input.trim().toLowerCase().includes(expected.trim().toLowerCase());
    case "REGEX":
      try {
        return new RegExp(expected).test(input);
      } catch (e) {
        return false;
      }
    default:
      return false;
  }
}
