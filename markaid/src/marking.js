import {
  CRITERIA_CLASSNAME,
  CRITERIA_MGMT_PAGE_PATH,
  SESSION_STORAGE_CRITERIA_KEY,
  CRITERION_APPLIED_CHECKBOX_CLASSNAME,
  SESSION_STORAGE_INITIAL_MARK_KEY,
} from "./constants.js";

import { Criterion, makeCriterionMarkingHTML } from "./criterion.js";

const MARKS_TEXTAREA_ID = "marks_textarea";

function addCriterion(criterion) {
  const criterionNode = makeCriterionMarkingHTML(
    criterion,
    applyCriterion,
    removeCriterion
  );
  document.getElementById("criteria_list_container").appendChild(criterionNode);
}

function loadMarkingSheet(criteria, initialMark) {
  if (criteria !== null) {
    criteria.forEach(addCriterion);
  }

  if (initialMark !== null) {
    document.getElementById("grade_p").textContent = initialMark;
  }
}

function manageSheetBtnHandler() {
  window.location.href = CRITERIA_MGMT_PAGE_PATH;
}

function copyBtnHandler() {
  const appliedCriteria = document.getElementById(MARKS_TEXTAREA_ID).textContent;
  navigator.clipboard.writeText(appliedCriteria);
}

function resetBtnHandler() {
  document.getElementById(MARKS_TEXTAREA_ID).value = "";
  let checkbox;
  for (checkbox of document.getElementsByClassName(
    CRITERION_APPLIED_CHECKBOX_CLASSNAME
  )) {
    checkbox.checked = false;
  }
  const initialMark = window.sessionStorage.getItem(
    SESSION_STORAGE_INITIAL_MARK_KEY
  );
  document.getElementById("grade_p").textContent = initialMark;
}

function applyClickHandlers() {
  document.getElementById("copy_btn").onclick = copyBtnHandler;
  document.getElementById("reset_btn").onclick = resetBtnHandler;
  document.getElementById("manage_sheet_btn").onclick = manageSheetBtnHandler;
}

function updateTotalGrade(delta) {
  const gradeP = document.getElementById("grade_p");
  gradeP.textContent = parseInt(gradeP.textContent) + delta;
}

function applyCriterion(criterion) {
  return () => {
    const textarea = document.getElementById(MARKS_TEXTAREA_ID);
    const commentsInput = document.getElementById("comments_input");
    let comments = commentsInput.value;
    commentsInput.value = "";
    if (0 < comments.length) {
       comments = ": " + comments;  
    }
    textarea.value += criterion.description + comments + "\n";
    updateTotalGrade(parseInt(criterion.value));
  };
}

function removeCriterion(criterion) {
  return () => {
    const textarea = document.getElementById(MARKS_TEXTAREA_ID);
    let appliedCriteria = textarea.value.split("\n");
    
    const index = appliedCriteria.findIndex(appliedCriterion => {
      const candidate = appliedCriterion.substring(0, criterion.description.length);
      return candidate.normalize() === criterion.description.normalize();
    });
    
    if (index === -1) {
      return;
    }

    let newAppliedCriteriaText = "";
    for (let i=0; i < appliedCriteria.length; i++) {
      if (i !== index && appliedCriteria[i] !== "\n" && appliedCriteria[i].length !== 0) {
        newAppliedCriteriaText += appliedCriteria[i] + "\n";
      }
    }    
 
    textarea.value = newAppliedCriteriaText;
    updateTotalGrade(0 - parseInt(criterion.value));
  };
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
