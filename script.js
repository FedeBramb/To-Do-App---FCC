// la Form
// finestra modale con messaggio quando usciamo mentre stavamo immettendo una nuova task
// add new tag button
// pulsante X per chiudere la newTag form 
// pulsante Add della newTag form
// Cancel button nella finestra modale
// Discard button nella finestra modale
// Container dove stanno le task

const taskForm = document.getElementById("task-form"); 
const confirmCloseDialog = document.getElementById("confirm-close-dialog"); 
const openTaskFormBtn = document.getElementById("open-task-form-btn"); 
const closeTaskFormBtn = document.getElementById("close-task-form-btn"); 
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn"); 
const cancelBtn = document.getElementById("cancel-btn"); 
const discardBtn = document.getElementById("discard-btn"); 
const tasksContainer = document.getElementById("tasks-container"); 
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

//Memorizziamo in taskData i dati presenti nel localStorage riportandoli da stringa a elemento originale,
//  se non sono presenti, associamo un array vuoto.
//Inizializziamo currentTask vuoto.

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

//Funzione per aggiungere o aggiornare taskData:
// memorizziamo in dataArrIndex l'indice dell'item con lo stesso id della task corrente.
//Creiamo un taskObj con come keys l'id: template string contenente l'id univoco creato.
//Controlliamo l'attività, se non è presente la aggiungiamo in cima all'array.
//  (-1 lo si ottiene se non troviamo la corrispondenza con .findIndex())
//  altrimenti se è già presente lo aggiorniamo.
//Carichiamo su localStorage i nuovi dati.
//Aggiorniamo il taskContainer
//chiamiamo reset() per ripulire i campi di input.

const addOrUpdateTask = () => {
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer()
  reset()
};

//Funziona che aggiorna il container delle attività.
//Ogni volta che questa funzione viene chiamata, l'HTML all'interno di tasksContainer viene rimosso.
//Loopiamo attraverso l'array di dati aggiungendo all'HTML già presente un container con l'id
//  uguale all'id della task e i due bottoni per modificare o cancellare la task.

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `)
    }
  );
};

//ButtonEL è il che nome che diamo a this non che l'event o "e" in alcuni casi.
//Utilizzando findIndex, viene cercato l'indice nell'array taskData dell'elemento 
// con l'ID uguale all'ID del genitore del pulsante.
//Rimuoviamo l'attività.
//Rimuoviamo l'elemento corrispondente dall'array taskData.
//Aggioriamo il localStorage.

const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
}

//Come sopra.
//Aggiorniamo la currentTask con l'elemento di taskData con indice dell'attività.
//I valori delle proprietà dell'oggetto currentTask vengono utilizzati 
// per popolare i campi del form, in modo che siano precompilati con i dettagli dell'attuale attività.
//Modifica il testo del pulsante del form per riflettere che l'azione sarà un aggiornamento dell'attività.
//Toglie o aggiunge la classe "hidden" all'elemento taskForm, mostrando il form di aggiornamento dell'attività.

const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");  
}

//Reimpostiamo i campi di input del form e l'attuale attività corrente.

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
}

//Controlliamo se l'array taskData contiene qualche attività. Se la sua lunghezza è maggiore di zero 
// (cioè se ci sono attività), chiama la funzione updateTaskContainer().
//La funzione updateTaskContainer() si occupa di visualizzare le attività nell'interfaccia utente.
//Quando viene cliccato, alterna la classe "hidden" dell'elemento taskForm, rendendolo visibile o invisibile.

//Aggiungiamo un eventListener al bottone di chiusura della form per aggiungere un'attività.
// Associamo a una variabile un boolean se ci sono valori presenti negli input o meno.
//  Associamo a una variabile un boolean se i valori presenti negli input sono diversi o meno dall'attività corrente.
//   Se tutti e due sono boolean positivi mostriamo la finestra confirmCloseDialog,
//    altrimenti resettiamo.

if (taskData.length) {
    updateTaskContainer();
  }

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

//Quando il pulsante cancelBtn nella finestra di dialogo di conferma viene cliccato, 
// chiude la finestra di dialogo senza fare nulla.

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

//Quando il Discard button viene cliccato viene chiusa la schermata modal e resettato il tutto.

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

//Quando la taskForm viene inviata previene l'aggiornamento della pagina e chiama la funzione
// addOrUpdateTask() per aggiungere o aggiornare l'attività nel sistema.

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});