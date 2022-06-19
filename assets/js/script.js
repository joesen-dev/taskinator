var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();
  
  // package up data as an object
  var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
  };

  // send taskDataObj as an argument to createTaskEl
  createTaskEl(taskDataObj);
  
};

var createTaskEl = function (taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
   var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  // use taskIdCounter as the argument to create buttons that correspond to the current task id
  var taskActionsEl = createTaskActions(taskIdCounter);
  // append taskActionsEl to listItemEl before listItemEl is appended to the page
  listItemEl.appendChild(taskActionsEl);  

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  // increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function(taskId) {
  //  create a new <div> element with the class name "task-actions"
  // This <div> will act as a container for the other elements.
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);
  return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
   // get target element from event
   var targetEl = event.target;

   // edit button was clicked
   if (targetEl.matches(".edit-btn")) {
     var taskId = targetEl.getAttribute("data-task-id");
     editTask(taskId);
   } 

   // delete button was clicked
   else if (targetEl.matches(".delete-btn")) {
     var taskId = targetEl.getAttribute("data-task-id");
     deleteTask(taskId);
   }
  // // console-logging event.target reports the element on which the event occurs, in this case, the click event
  // console.log(event.target);
};

// Add an Edit Task Function
var editTask = function(taskId) {
  // get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // taskSelected.querySelector() vs. document.querySelector()
    // document.querySelector() searches within the document element, which is the entire page
    // taskSelected.querySelector() only searches within the taskSelected element.
  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;

  //  add the task's name and type to the form
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // UI improvement for the user: "Add Task" button changes to "Save Task" to indicate that the form is in edit mode
  document.querySelector("#save-task").textContent = "Save Task";
  // add the taskId to a data-task-id attribute on the form itself for use to save the correct task
  formEl.setAttribute("data-task-id", taskId);

  
};

// Add a Delete Task Function
var deleteTask = function(taskId) {
  // BREAK DOWN OF var taskSelected 
    // 1. select a list item using .task-item 
    // 2. further narrow search by looking for a .task-item that has a data-task-id equal to the argument we've passed into the function
    // NOTE: there's no space between the .task-item and the [data-task-id] attribute
      // this means that both properties must be on the same element; a space would look for a element with the [data-task-id] attribute somewhere inside a .task-item element.
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

pageContentEl.addEventListener("click", taskButtonHandler);