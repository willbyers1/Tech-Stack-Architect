export interface ParsedReadme {
    description: string | null;
    installation: string | null;
    usage: string | null;
    author: string | null;
    license: string | null;
    rawContent: string;
    fileSize: number;
}

export function parseReadme(content: string, fileSize: number): ParsedReadme {
    const lines = content.split('\n');

    const getSection = (keywords: string[], isDescription = false): string | null => {
        let inSection = false;
        let sectionContent: string[] = [];
        let sectionLevel = 0;

        for (const line of lines) {
            const headingMatch = line.match(/^(#+)\s+(.*)/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const title = headingMatch[2].toLowerCase();

                if (inSection) {
                    if (level <= sectionLevel) {
                        break; // End of current section
                    }
                } else {
                    // For description, we also accept the first H1
                    if (keywords.some(kw => title.includes(kw)) || (isDescription && level === 1)) {
                        inSection = true;
                        sectionLevel = level;
                        continue;
                    }
                }
            }

            if (inSection) {
                sectionContent.push(line);
            }
        }

        const joined = sectionContent.join('\n').trim();
        return inSection && joined.length > 0 ? joined : null;
    };

    return {
        description: getSection(['about', 'overview'], true),
        installation: getSection(['installation', 'setup']),
        usage: getSection(['usage', 'example']),
        author: getSection(['author', 'contact']),
        license: getSection(['license']),
        rawContent: content,
        fileSize
    };
}
