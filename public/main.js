$(document).ready(function () {
    const localURL = "http://localhost:3000/api/todos/";

    const deleteTodo=(parent)=>{
        let elId=parent.data().id;
        parent.remove();        
        $.ajax({type: "DELETE",
        url: localURL+elId});       
        
    }

    const getTodos = ()=>{
        $.get({
            url: localURL
        })
        .then(data =>{
          
           data.forEach(todo=>{
               let $deleteButton = $("<span class='delete-button'></span>");
               $deleteButton.click(function(e){
                e.stopPropagation();
                deleteTodo($(e.target).closest("li"));
                 });
               $deleteButton.html(" X");
               let $listItem=$("<li></li>");
               if (todo.completed){
                   $listItem.addClass("completed");
               }
               $listItem.data("id",todo.id);
                 $listItem.html(`${todo.name}`).append($deleteButton);
                $("#todo-list").append($listItem);

                $listItem.click(function(){
                    $(this).toggleClass("completed");
                    $.ajax({type: "PUT", url: localURL+$listItem.data().id});
                })
               
            });

        })
        .fail(err=>console.log(err));
    }
    
    getTodos();
    
    const addTodo=()=>{
       
        let inputValue = $("#new-todo").val();
        $.post({url: localURL+inputValue });
        $("#todo-list").append(`<li>${inputValue}<span class="delete"> X</span></li>`)
        $(".delete").click(function(e){
            e.stopPropagation();
            console.log($(this).parent())
        });
        $("#new-todo").val("");

    }
    $("#add-todo").click(function(e){
        e.preventDefault();
        addTodo();
    });

    //add on click update-remember that if they're added after the fact then they won't have it
  

    //add on click deletion-remember that if they're added after the fact then they won't have it

    
});
