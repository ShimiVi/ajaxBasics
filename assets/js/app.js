const $loadBtn = $('#load');
const $status = $('#status');
const $list = $('#list');
const $form = $('#todo-form')
const $title =$form.find('input[name="title"]');

let todos = []; 

function render(){
    $list.empty();
    if(!todos.length){
        $list.append('<li>אין משימות להצגה</li>')
        return;
    }
    todos.forEach(t =>{
        const li = `<li><strong>#${t.id}</strong> ${t.title}</li>`
        $list.append(li);
    })
}
function setStatus(msg) {
    $status.text(msg || '');
}

function clearStatus(){
    setStatus('');
}

//טעינת משימות מהשרת

function loadTodos(){
    setStatus('טוען...');


$.ajax({
    url: 'https://jsonplaceholder.typicode.com/todos',
    method: 'GET', 
    data: {_limit: 5},
    dataType: 'json', 
    timeout: 8000 
})

.done(function(data){
    todos = data.map(item => ({
        id: item.id, 
        title: item.title
    })); 
    render();
    setStatus(`נטענו ${todos.length} משימות`);
})


.fail(function(jqXHR, textStatus){
    setStatus('שגיאה בטעינה: ' + textStatus);
    // לדיבוג: console.log(jqXHR.status, jqXHR.responseText)
});
}

function addTodo(title){


    setStatus('שולח...');

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/todos',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
            title: title, 
            completed: false, 
            userId:1
        })
    })

    .done(function(created) {
        todos.unshift({id: created.id, title: created.title})
        render();
        setStatus('נוסף בהצלחה');
    })

    .fail(function(jqXHR, textStatus){
    setStatus('שגיאה בטעינה: ' + textStatus);
});
}
 
function updateTodo(id, newTitle){

setStatus('מעדכן...');

    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/todos/' + id,
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
            id:id , 
            title: newTitle, 
            completed: true, 
            userId:1
        })
    })

    .done(function(updated) {
        setStatus('עודכן בהצלחה')
        console.log("העדכון:" , updated)
    })

    .fail(function(jqXHR, textStatus){
    setStatus('שגיאה :' + textStatus);
});
}


$loadBtn.on('click' , function(){
   loadTodos();
}); 

$form.on('submit', function(ev){
 ev.preventDefault(); 

const title = $title.val().trim(); 
if(!title){
    setStatus('כותרת לא יכולה להיות ריקה')
    $title.focus();
    return;
}
    addTodo(title); 

    $form.trigger('reset'); 
    $title.focus();
}); 


$('#update-form').on('submit', function(ev){
    ev.preventDefault();


const id =Number($('#update-id').val());
const newTitle = $('#update-title').val().trim();

if(!id || !newTitle){
    setStatus('צריך למלא גם id וגם title');
    return;
}

updateTodo(id, newTitle);
    $(this).trigger('reset');
}); 

render();
clearStatus();

