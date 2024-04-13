const BACK_END_URI = "https://lg2evf50hd.execute-api.ap-southeast-1.amazonaws.com/prod";
const COMMON_NOTE_URI = `${BACK_END_URI}` + "/notes"

const addBox = document.querySelector(".add-box")
const popupBox = document.querySelector(".popup-box")

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

const closeBox = popupBox.querySelector("header i")
const titleTag = popupBox.querySelector("input")
const descTag = popupBox.querySelector("textarea")
const addBtn = popupBox.querySelector("button")
let existingId = null;
const notes = JSON.parse(localStorage.getItem('notes') || '[]')

const menuel = document.querySelector('.iconel')

const showNotes = () => {
    fetch(COMMON_NOTE_URI, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(response => {

            document.querySelectorAll('.note').forEach(note => note.remove())
            response.forEach((note, index) => {
                let litag = `<li class="note">
                            <div class="details">
                                <p> ${note.title} </p>
                                <span>${note.description}
                                </span>
                            </div>
                            <div class="bottom-content">
                                <span>${note.date != null ? new Date(note.date).toLocaleDateString() + " " + new Date(note.date).toLocaleTimeString() : ""}</span>
                                <div class="settings">
                                    <i onclick=showMenu(this) class="fa-solid fa-ellipsis iconel"></i>
                                    <ul class="menu">
                                        <li onclick="editNote(${index},'${note.id}','${note.title}','${note.description}')"><i class="fa-light fa-pen"></i>Edit</li>
                                        <li onclick="deleteNote(${index},'${note.id}')"><i class="fa-duotone fa-trash"></i>Delete</li>
                                    </ul>
                                </div>
                            </div>
                     </li>`

                addBox.insertAdjacentHTML('afterend', litag)
            })
        })
}

function showMenu(elem) {
    elem.parentElement.classList.add('show')
    document.onclick = (e) => {
        if (e.target.tagName != 'I' || e.target != elem) {
            elem.parentElement.classList.remove('show')
        }
    }
    // console.log(elem)
}

function deleteNote(index,noteId) {

    fetch(COMMON_NOTE_URI, {
        method: 'DELETE',
        body: JSON.stringify({id:noteId})
    })
        .then(response => response.json())
        .then(response => {
            alert(response);
            showNotes();
        })
}

function editNote(index, noteId, title, description) {
    popupBox.classList.add("show");
    existingId = noteId;
    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
}

addBox.onclick = () => {
    popupBox.classList.add("show");
}
closeBox.onclick = () => {
    titleTag.value = ''
    descTag.value = ''
    popupBox.classList.remove("show");

}
addBtn.onclick = (e) => {
    console.log(e);
    e.preventDefault()
    //    menuel.classList.add('hide-icon')

    let title = titleTag.value;
    let desc = descTag.value;
    let noteInfo = {
        id: `${existingId? existingId: generateUUID()}`,
        title: title,
        description: desc,
        date: `${new Date()}`
    }

    fetch(COMMON_NOTE_URI, {
        method: 'POST',
        body: JSON.stringify(noteInfo)
    })
        .then(response => response.json())
        .then(response => {
            alert('Save successfully')
            showNotes();
        })

    closeBox.click();
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
showNotes()
console.log(existingId);