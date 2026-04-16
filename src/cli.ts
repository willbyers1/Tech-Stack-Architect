#!/usr/bin/env node
import { readReadme, getFileSize } from './io.js';
import { parseReadme } from './parser.js';
import { scoreReadme, ScoreResult } from './scorer.js';

function printBeautifulOutput(result: ScoreResult, filePath: string) {
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const red = "\x1b[31m";
    const cyan = "\x1b[36m";

    console.log(`\n${bold}${cyan}=== README Scorer ===${reset}\n`);
    console.log(`${bold}Target File:${reset} ${filePath}\n`);

    const printSection = (name: string, data: { score: number; max: number; notes: string }) => {
        const color = data.score === data.max ? green : (data.score > 0 ? yellow : red);
        const paddedName = name.padEnd(14, ' ');
        console.log(`${bold}${paddedName}:${reset} ${color}${data.score.toString().padStart(2, ' ')}/${data.max}${reset} - ${data.notes}`);
    };

    printSection('Description', result.breakdown.description);
    printSection('Installation', result.breakdown.installation);
    printSection('Usage', result.breakdown.usage);
    printSection('Author Info', result.breakdown.author);

    if (result.breakdown.modifiers.notes.length > 0) {
        console.log(`\n${bold}Modifiers:${reset}`);
        result.breakdown.modifiers.notes.forEach((note: string) => {
            const color = note.includes('+') ? green : red;
            console.log(`  ${color}${note}${reset}`);
        });
    }

    console.log(`\n${bold}---------------------${reset}`);
    const totalColor = result.totalScore >= 80 ? green : (result.totalScore >= 50 ? yellow : red);
    console.log(`${bold}Total Score:${reset}   ${bold}${totalColor}${result.totalScore}/100${reset}\n`);
}

function main() {
    const args = process.argv.slice(2);
    let format = 'text';
    let filePath = 'README.md';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--format' && args[i + 1]) {
            format = args[i + 1];
            i++;
        } else if (!args[i].startsWith('-')) {
            filePath = args[i];
        }
    }

    const content = readReadme(filePath);
    const size = getFileSize(filePath);

    const parsed = parseReadme(content, size);
    const score = scoreReadme(parsed);

    if (format === 'json') {
        console.log(JSON.stringify(score, null, 2));
    } else {
        printBeautifulOutput(score, filePath);
    }
}

main();
