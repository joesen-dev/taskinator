var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];


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
  
  var isEdit = formEl.hasAttribute("data-task-id");

  // form has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    // call a new function, completeEditTask(), passing it three arguments: name input value, type input value, and task id
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute on form, so create object as normal and pass to createTaskEl function
  else {
    // package up data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    // send taskDataObj as an argument to createTaskEl
    createTaskEl(taskDataObj);
  } 
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

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks()

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

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array and task object with new content
    // At each iteration of this for loop, we are checking to see if that individual task's id property matches the taskId argument that we passed into completeEditTask() 
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  saveTasks()

  alert("Task Updated!");

  // Reset form by removing the task id and changing the button text back to normal
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
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

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId (does not have the same id value as the task we want to delete), let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks()
};

var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
    // NOTE: the variable taskSelected didn't create a second <li>. That would only be the case if we used document.createElement(). 
      // Instead, it's a reference to an existing DOM element, and we simply appended that existing element somewhere else.
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  // console.log(event.target);
  // console.log(event.target.getAttribute("data-task-id"));

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  saveTasks()
};

// function to SAVE tasks to localStorage
var saveTasks = function() {
  // NOTE:localStorage can only store one type of data: strings. It will convert any data sent into a string
    // JSON.stringify is used to convert the tasks object into a JSON (JavaScript Object Notation) string
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
// function to LOAD tasks to localStorage
  // 1. Gets task items from localStorage.

  // 2 .Converts tasks from the string format back into an array of objects.

  // 3. Iterates through a tasks array and creates task elements on the page from it.
var loadTasks = function() {
  // reassign tasks array to current localStorage
  var tasks = localStorage.getItem("tasks");
  console.log(tasks);

  // 1. Check if tasks is equal to null by using an if statement.
  if (tasks === null) {
      // 2. If it is, set tasks back to an empty array by reassigning it to [] and adding a return false. We don't want this function to keep running with no tasks to load onto the page.
    var tasks = [];
    return false    
  }

  // JSON.parse turns covers localStorage strings into JSON objects
  tasks = JSON.parse(tasks);
  console.log(tasks);

  // Create a for loop with a condition of i < tasks.length
  for (var i = 0; i < tasks.length; i++) {
    console.log(tasks[i]);
    // 1. To keep the id for each task in sync, reassign the id property of task[i] to the value of taskIdCounter
    var id = taskIdCounter
    console.log(tasks[i].id);

    // 3. Create a <li> element and store it in a variable called listItemEl.
    var listItemEl = document.createElement("li");
    // Give <li> element a classname attribute of task-item.
    listItemEl.className = "task-item";
    console.log(listItemEl)
    // Using setAttribute(), give <li> element a data-task-id attribute with a value of tasks[i].id.
    listItemEl.setAttribute("data-task-id", tasks[i].id);
    console.log(listItemEl)

    // 4. Create a <div> element and store it in a variable called taskInfoEl
    var taskInfoEl = document.createElement("div");
    // Give it a classname property of task-info to set the HTML class attribute.
    taskInfoEl.className = "task.info"
    console.log(taskInfoEl)
    // Set its innerHTML property
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
    console.log(taskInfoEl)

    // 5. Append taskInfoEl to listItemEl.
    listItemEl.appendChild(taskInfoEl);

    // 6. Create the actions for the task by creating a variable called taskActionsEl and giving it a value of createTaskActions() with tasks[i].id as the argument.
    var taskActionsEl = createTaskActions(tasks[i].id); 

    // 7. Append taskActionsEl to listItemEl.
    listItemEl.appendChild(taskActionsEl);
    console.log(listItemEl);

    // 8. With an if statement, check if the value of tasks[i].status is equal to to do.
    if (tasks[i].status === "to do") {
      // If yes, use listItemEl.querySelector("select[name='status-change']").selectedIndex and set it equal to 0.
      listItemEl.querySelector("select[name='status-change']").selectedIndex
      tasks[i].status = "0"
      console.log(tasks[i].status)
      // Append listItemEl to tasksToDoEl.
      tasksToDoEl.appendChild(listItemEl);
      console.log(tasksToDoEl);
    }
    // 9. else if, check if the value of tasks[i].status is equal to in progress.
    else if (tasks[i].status === "in progress") {
      // If yes, use listItemEl.querySelector("select[name='status-change']").selectedIndex and set it equal to 1.
      listItemEl.querySelector("select[name='status-change']").selectedIndex
      tasks[i].status = "1"
      console.log(tasks[i].status)
      // Append listItemEl to tasksInProgressEl.
      tasksInProgressEl.appendChild(listItemEl);
      console.log(tasksInProgressEl);
    }
    // 10. else if, check if the value of tasks[i].status is equal to complete.
    else if (tasks[i].status === "complete") {
      // If yes, use listItemEl.querySelector("select[name='status-change']").selectedIndex and set it equal to 2.
      listItemEl.querySelector("select[name='status-change']").selectedIndex
      tasks[i].status = "2"
      console.log(tasks[i].status)
      // Append listItemEl to tasksCompletedEl.
      tasksCompletedEl.appendChild(listItemEl);
      console.log(tasksCompletedEl);
    }
    // 11. Increase taskIdCounter by 1.
    taskIdCounter++;
    console.log(listItemEl);    
  }

}
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();