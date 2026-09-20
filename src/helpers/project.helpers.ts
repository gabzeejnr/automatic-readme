import { ignoredFF } from "../arrays/project.arrays.js";
import type { Dirent } from "fs";

export function folderFileSort(
    array: Dirent[],
    folderArray: string[],
    fileArray: string[]
): {
    folderArray: string[],
    fileArray: string[]
} {

    /* 
    *This function checks the file & folder array and sorts them into files and folders
    */

    array.forEach(arr => {
        if (ignoredFF.includes(arr.name)) return;

        if (arr.isDirectory()) {
            folderArray.push(arr.name);
        } else {
            fileArray.push(arr.name);
        }
    })

    return {
        folderArray,
        fileArray
    }
}