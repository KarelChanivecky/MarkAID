import { FILE_TYPE } from "./constants.js";
import { Criterion } from "./criterion.js";

/**
 * Import criteria from json file
 * @param {File} file file to read criteria from
 */
export function importCriteria(file, successHandler, errorHandler) {
    if (file === null) {
        errorHandler();
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        successHandler(reader.result);
    }

    reader.onerror = errorHandler;
}

/**
 * Export criteria to file
 * 
 * special thanks: https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js
 * 
 * @param {Array<Criterion>} criteria an array of Criterion objects
 * @param {number} initialMark the initial mark
 * @param {string} criteriaName name to be used for the file
 */
export function exportCriteria(criteria, initialMark, criteriaName) {
    const markingSheet = {criteria, initialMark}

    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(markingSheet)], { type: FILE_TYPE });
    
    a.href = URL.createObjectURL(file);
    a.download = criteriaName + ".json";
    a.click();

    URL.revokeObjectURL(a.href);
}
