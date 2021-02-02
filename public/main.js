$(document).ready(function () {
    const localURL = "http://localhost:3000/api/todos/";

    const deleteTodo = (parent) => {
        let elId = parent.data().id;
        parent.remove();
        $.ajax({
            type: "DELETE",
            url: localURL + elId
        });

    }
    const addDelete = () => {
        let btn = $("<span class='delete-button'> X</span>");
        btn.click(function (e) {
            e.stopPropagation();
            deleteTodo($(e.target).closest("li"));
        });
        return btn;
    }

    const addTodo = (todo) => {

        let $listItem = $("<li></li>");
        if (todo.completed) {
            $listItem.addClass("completed");
        }
        $listItem.data("id", todo.id);
        let $deleteButton = addDelete();

        $listItem.html(`<span class="todo-description">${todo.name}</span>`).append($deleteButton);
        $listItem.click(function() {
            $(this).toggleClass("completed");
            $.ajax({
                type: "PUT",
                url: localURL + $listItem.data().id
            });
        });
        $("#todo-list").append($listItem);

    }

    const getTodos = () => {
        $.get({
                url: localURL
            })
            .then(data => {
                data.forEach(todo => {
                    addTodo(todo);
                });
            })
            .fail(err => console.log(err));
    }

    getTodos();

    $("#add-todo").click(function (e) {
        e.preventDefault();
        let inputValue = $("#new-todo").val();
        if (inputValue.trim()!==""){
            $.post({
                url: localURL,
                data: {
                    "name": inputValue
                },
                dataType: "json"
            }).then(data => {
                addTodo(data.rows[0]);
            });
        } else {
            alert("Can't accept blank value.");
        }
        

        $("#new-todo").val("");
    });

});