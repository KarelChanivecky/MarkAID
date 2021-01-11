import {
  CRITERION_APPLIED_CHECKBOX_CLASSNAME,
  SESSION_STORAGE_CRITERIA_KEY,
  CRITERIA_CLASSNAME,
} from "./constants.js";

const CRITERIA_ID_PREFFIX = "criterion_";

function removeCriterionHTML(node) {
  node.parentElement.removeChild(node);
}

function removeCriterionFromStorage(criterion) {
  let criteria = JSON.parse(
    window.sessionStorage.getItem(SESSION_STORAGE_CRITERIA_KEY)
  );
  if (criteria === null) {
    return;
  }
  const index = criteria.findIndex(
    (candidate) =>
      candidate.value === criterion.value &&
      candidate.description.normalize() === criterion.description.normalize()
  );
  criteria.splice(index, 1);
  window.sessionStorage.setItem(
    SESSION_STORAGE_CRITERIA_KEY,
    JSON.stringify(criteria)
  );
}

function generateCriterionID() {
  return CRITERIA_ID_PREFFIX + Date.now();
}

function makeCriterionManagementHTML(criterion, editHandler) {
  const { value, description } = criterion;

  const criterionDiv = document.createElement("div");
  criterionDiv.id = generateCriterionID();
  criterionDiv.classList = [CRITERIA_CLASSNAME];
  criterionDiv.draggable = true;

  const valueP = document.createElement("p");
  const descriptionP = document.createElement("p");
  valueP.textContent = value;
  descriptionP.textContent = description;
  
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "🗑";
  removeBtn.onclick = () => {
    removeCriterionHTML(criterionDiv);
    removeCriterionFromStorage(criterion);
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "🖉";
  editBtn.onclick = () => {
    editHandler();
    removeCriterionHTML(criterionDiv);
    removeCriterionFromStorage(criterion);
  };

  //   const STATIC_KNOB_CLASSNAME = "criterion_knob_static";
  //   const DRAGGED_KNOB_CLASSNAME = "criterion_knob_grabbed";
  //   const knob = document.createTextNode("‖");
  //   knob.classList = ["criterion_knob", STATIC_KNOB_CLASSNAME];
  //   knob.on

  criterionDiv.appendChild(valueP);
  criterionDiv.appendChild(descriptionP);
  criterionDiv.appendChild(removeBtn);
  criterionDiv.appendChild(editBtn);
  //   criterionDiv.appendChild(knob);

  return criterionDiv;
}

function makeCriterionMarkingHTML(criterion, applyHandler, removeHandler) {
  const { value, description } = criterion;

  const criterionDiv = document.createElement("div");
  criterionDiv.id = generateCriterionID();
  criterionDiv.classList = [CRITERIA_CLASSNAME];

  const criterionAppliedCheckbox = document.createElement("input");
  criterionAppliedCheckbox.type = "checkbox";
  criterionAppliedCheckbox.checked = false;
  criterionAppliedCheckbox.classList = CRITERION_APPLIED_CHECKBOX_CLASSNAME;
  criterionAppliedCheckbox.onclick = () => {
    const checkboxHandler = criterionAppliedCheckbox.checked
      ? applyHandler(criterion)
      : removeHandler(criterion);
    checkboxHandler();
  };

  const valueP = document.createElement("p");
  const descriptionP = document.createElement("p");
  valueP.textContent = value;
  descriptionP.textContent = description;

  criterionDiv.appendChild(criterionAppliedCheckbox);
  criterionDiv.appendChild(valueP);
  criterionDiv.appendChild(descriptionP);
  return criterionDiv;
}

function Criterion(value, description) {
  this.value = value;
  this.description = description;
}

export { makeCriterionManagementHTML, makeCriterionMarkingHTML, Criterion };
