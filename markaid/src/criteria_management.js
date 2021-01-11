import {
  INITIAL_MARK_INPUT_ID,
  MARKING_PAGE_PATH,
  SESSION_STORAGE_CRITERIA_KEY,
  SESSION_STORAGE_INITIAL_MARK_KEY,
} from "./constants.js";
import { Criterion, makeCriterionManagementHTML } from "./criterion.js";
import { importCriteria, exportCriteria } from "./file_io.js";

const VALUE_INPUT_ID = "value_input";
const DESCRIPTION_INPUT_ID = "description_input";

function addCriterion(criterion) {
  const valueInput = document.getElementById(VALUE_INPUT_ID);
  const descriptionInput = document.getElementById(DESCRIPTION_INPUT_ID);
  const criterionNode = makeCriterionManagementHTML(criterion, () => {
    valueInput.value = criterion.value;
    descriptionInput.value = criterion.description;
  });
  valueInput.value = 0;
  descriptionInput.value = "";
  document.getElementById("criteria_list_container").appendChild(criterionNode);
}

function loadMarkingSheet(criteria, initialMark) {
  if (criteria !== null) {
    criteria.forEach(addCriterion);
  }

  if (initialMark !== null) {
    document.getElementById(INITIAL_MARK_INPUT_ID).value = initialMark;
  }
}

function markBtnHandler() {
  const initialMark = document.getElementById(INITIAL_MARK_INPUT_ID).value;
  window.sessionStorage.setItem(SESSION_STORAGE_INITIAL_MARK_KEY, initialMark);
  window.location.href = MARKING_PAGE_PATH;
}

function importBtnHandler() {
    const fileSelector = document.createElement("input");
  fileSelector.type = "file";
  fileSelector.onchange = (e) => {
    const file = e.target.files[0];
    importCriteria(
      file,
      // on success
      (markingSheetString) => {
        resetBtnHandler();
        const {initialMark, criteria} = JSON.parse(markingSheetString);
        loadMarkingSheet(criteria, initialMark);
        window.sessionStorage.setItem(
          SESSION_STORAGE_CRITERIA_KEY,
          JSON.stringify(criteria)
        );
        window.sessionStorage.setItem(
          SESSION_STORAGE_INITIAL_MARK_KEY,
          initialMark
        );
      },

      // on error
      () => {
        window.alert("ERROR! Could not read file!");
      }
    );
  };
  fileSelector.click();
}

function exportBtnHandler() {
  const fileName = window.prompt("Enter filename:");
  if (fileName.length === 0) {
    window.alert("Enter a filename.");
  }
  const initialMark = document.getElementById(INITIAL_MARK_INPUT_ID).value;
  exportCriteria(JSON.parse(window.sessionStorage.getItem(SESSION_STORAGE_CRITERIA_KEY)), initialMark, fileName);
}

function addCriterionHandler() {
  const value = document.getElementById(VALUE_INPUT_ID).value;
  const description = document.getElementById(DESCRIPTION_INPUT_ID).value;
  const criterion = new Criterion(value, description);
  addCriterion(criterion);
  const criteria = JSON.parse(
    window.sessionStorage.getItem(SESSION_STORAGE_CRITERIA_KEY)
  );
  criteria.push(criterion);
  window.sessionStorage.setItem(
    SESSION_STORAGE_CRITERIA_KEY,
    JSON.stringify(criteria)
  );
}

function resetBtnHandler() {
  document.getElementById("criteria_list_container").innerHTML = "";
  let criteria = [];
  window.sessionStorage.setItem(
    SESSION_STORAGE_CRITERIA_KEY,
    JSON.stringify(criteria)
  );
  let initialMark = 0;
  window.sessionStorage.setItem(
    SESSION_STORAGE_INITIAL_MARK_KEY,
    JSON.stringify(initialMark)
  );
}

function applyClickHandlers() {
  document.getElementById("mark_btn").onclick = markBtnHandler;
  document.getElementById("import_btn").onclick = importBtnHandler;
  document.getElementById("export_btn").onclick = exportBtnHandler;
  document.getElementById("add_criterion_btn").onclick = addCriterionHandler;
  document.getElementById("reset_btn").onclick = resetBtnHandler;
}

function loadSessionStorage() {
  let criteria = window.sessionStorage.getItem(SESSION_STORAGE_CRITERIA_KEY);
  let initialMark = window.sessionStorage.getItem(
    SESSION_STORAGE_INITIAL_MARK_KEY
  );
  if (criteria === null) {
    criteria = [];
    window.sessionStorage.setItem(
      SESSION_STORAGE_CRITERIA_KEY,
      JSON.stringify(criteria)
    );
  }
  if (initialMark === null) {
    initialMark = 0;
    window.sessionStorage.setItem(
      SESSION_STORAGE_INITIAL_MARK_KEY,
      JSON.stringify(initialMark)
    );
  }
  loadMarkingSheet(JSON.parse(criteria), initialMark);
}

function main() {
  applyClickHandlers();
  loadSessionStorage();
}

window.onload = main;
