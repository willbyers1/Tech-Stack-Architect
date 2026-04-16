import { ParsedReadme } from './parser.js';

export interface ScoreResult {
    totalScore: number;
    breakdown: {
        description: { score: number; max: number; notes: string };
        installation: { score: number; max: number; notes: string };
        usage: { score: number; max: number; notes: string };
        author: { score: number; max: number; notes: string };
        modifiers: { score: number; notes: string[] };
    };
}

export function scoreReadme(parsed: ParsedReadme): ScoreResult {
    const result: ScoreResult = {
        totalScore: 0,
        breakdown: {
            description: { score: 0, max: 25, notes: 'Missing' },
            installation: { score: 0, max: 25, notes: 'Missing' },
            usage: { score: 0, max: 25, notes: 'Missing' },
            author: { score: 0, max: 25, notes: 'Missing' },
            modifiers: { score: 0, notes: [] }
        }
    };

    // 1. Description (25 pts)
    if (parsed.description) {
        if (parsed.description.length > 50) {
            result.breakdown.description = { score: 25, max: 25, notes: 'Found (>50 chars)' };
        } else {
            result.breakdown.description = { score: 10, max: 25, notes: 'Found (<50 chars)' };
        }
    }

    // 2. Installation (25 pts)
    if (parsed.installation) {
        const hasCodeOrList = /```|^\s*[-*]\s|^\s*\d+\.\s/m.test(parsed.installation);
        if (hasCodeOrList) {
            result.breakdown.installation = { score: 25, max: 25, notes: 'Found (contains code blocks/lists)' };
        } else {
            result.breakdown.installation = { score: 15, max: 25, notes: 'Found (plain text only)' };
        }
    }

    // 3. Usage (25 pts)
    if (parsed.usage) {
        const hasCode = /```/m.test(parsed.usage);
        if (hasCode) {
            result.breakdown.usage = { score: 25, max: 25, notes: 'Found (contains code blocks)' };
        } else {
            result.breakdown.usage = { score: 10, max: 25, notes: 'Found (plain text only)' };
        }
    }

    // 4. Author Info (25 pts)
    if (parsed.author) {
        const hasLinkOrEmail = /\[.*\]\(.*\)|\<.*@.*\>|[\w.-]+@[\w.-]+\.\w+/m.test(parsed.author);
        if (hasLinkOrEmail) {
            result.breakdown.author = { score: 25, max: 25, notes: 'Found (contains link/email)' };
        } else {
            result.breakdown.author = { score: 15, max: 25, notes: 'Found (name only)' };
        }
    }

    // 5. Modifiers
    let modifierScore = 0;
    const modifierNotes: string[] = [];

    if (parsed.fileSize < 200) {
        modifierScore -= 10;
        modifierNotes.push('File size < 200 bytes (-10 pts)');
    }

    if (parsed.license) {
        modifierScore += 5;
        modifierNotes.push('License section found (+5 pts)');
    }

    result.breakdown.modifiers = { score: modifierScore, notes: modifierNotes };

    // Calculate total
    result.totalScore = 
        result.breakdown.description.score +
        result.breakdown.installation.score +
        result.breakdown.usage.score +
        result.breakdown.author.score +
        result.breakdown.modifiers.score;

    // Cap at 100, min 0
    result.totalScore = Math.min(Math.max(result.totalScore, 0), 100);

    return result;
}
