import fs from 'fs';
import path from 'path';

export function readReadme(filePath: string): string {
    try {
        const absolutePath = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(absolutePath)) {
            console.error(`Error: File not found at ${absolutePath}`);
            process.exit(1);
        }
        const stats = fs.statSync(absolutePath);
        if (!stats.isFile()) {
            console.error(`Error: Path is not a file: ${absolutePath}`);
            process.exit(1);
        }
        const content = fs.readFileSync(absolutePath, 'utf-8');
        if (content.trim().length === 0) {
            console.error(`Error: File is empty: ${absolutePath}`);
            process.exit(1);
        }
        return content;
    } catch (error: any) {
        console.error(`Error reading file: ${error.message}`);
        process.exit(1);
    }
}

export function getFileSize(filePath: string): number {
    try {
        const absolutePath = path.resolve(process.cwd(), filePath);
        return fs.statSync(absolutePath).size;
    } catch (error) {
        return 0;
    }
}
