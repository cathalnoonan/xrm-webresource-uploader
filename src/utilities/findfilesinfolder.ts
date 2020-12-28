import * as fs from 'fs/promises'
import * as path from 'path'

export function findFilesInFolder(folderPath: string): Promise<string[]> {
    return new Promise<string[]>(async (resolve) => {
        const filePaths: string[] = [];

        const folderContents = (await fs.readdir(folderPath)).map(p => path.join(folderPath, p));

        // Async foreach
        for await (const path of folderContents) {
            const item = await fs.lstat(path)
    
            if (item.isDirectory()) {
                const nestedFiles = await findFilesInFolder(path);
                nestedFiles.forEach(nestedFilePath => filePaths.push(nestedFilePath))
            } else {
                filePaths.push(path)
            }
        }

        resolve(filePaths)
    })
}