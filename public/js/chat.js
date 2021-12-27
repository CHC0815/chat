var app = {
    messages: [],
    currentRoomId: null,
    lastDate: null,
    roomPassword: null,
    userId: null,
    roomPassword: null,

    loadRoom() {
        this.messages = [];
        this.roomPassword = null;
        var container = document.querySelector("#messages");
        container.innerHTML = "";
        $('#modal').modal('show');
    },

    addMessage(message) {
        this.messages.push(message);
        $.ajax({
                url: '/users/' + message.sender_id,
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + getCookie("user-token")
                }
            })
            .done((user) => {
                var container = document.querySelector("#messages");
                var msg = document.createElement("div");
                if (user.id == app.userId) {
                    msg.classList.add("chat-message-right");
                } else {
                    msg.classList.add("chat-message-left");
                }
                msg.classList.add("pb-4");
                var msg_inner = `
                <div>
                    <img src="https://eu.ui-avatars.com/api/?name=${user.username}"
                        class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
                        <div class="text-muted small text-nowrap mt-2">${message.createdAt.split('T')[1].substring(0, 5)}</div>
                    </div>
                    <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                    <div class="font-weight-bold mb-1">${user.username}</div>
                    ${message.message}
                </div>
                `;
                msg.innerHTML = msg_inner;

                if (app.isAnotherDay(new Date(message.createdAt))) {
                    container.appendChild(app.createTimeSpliter(message.createdAt.substring(0, 10)));
                    app.lastDate = new Date(message.createdAt);
                }

                container.appendChild(msg);
                container.scrollTop = container.scrollHeight;
            });
    },

    createTimeSpliter(date) {
        var el = document.createElement("div");
        el.classList.add("pb-4");
        el.style = "text-align: center";
        el.innerHTML = `<p>== ${date} ==</p><br>`;
        return el;
    },
    isAnotherDay(date) {
        var current = this.lastDate;
        if (current == null) {
            // first message
            return true;
        }
        if (date > current) {
            if ((current.getDay() != date.getDay()) || (current.getMonth() != date.getMonth()) || (current.getFullYear() != date.getFullYear())) {
                return true;
            }
        }
    },
}

function getAllByRoom(roomId, limit = 50) {
    $.ajax({
        urL: '/room' + roomId,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie("user-token")
        }
    }).done((data) => {
        var name = data["name"];
        document.querySelector("#roomName").innerHTML = name;
        document.querySelector("#roomImage").setAttribute("src", `https://eu.ui-avatars.com/api/?name=${name}`);
    });
    $.ajax({
        url: '/messages/' + roomId + '/' + limit,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie("user-token")
        }
    }).done((messages) => {
        messages = messages.reverse();
        app.currentRoomId = roomId;
        app.lastDate = null;
        app.loadRoom();
        messages = messages;
        messages.forEach((message) => {
            app.addMessage(message);
        });
    });
}

function sendMessage() {
    if (!app.currentRoomId) {
        alert("Please select a room");
        return;
    }
    $.ajax({
        url: 'users/current',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie("user-token")
        }
    }).done((user) => {
        var sender_id = user["id"];
        var message = document.querySelector("#message").value;
        if (!message || message.length == 0) {
            return;
        }
        $.ajax({
            url: '/message/send',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getCookie("user-token")
            },
            data: {
                sender_id: sender_id,
                room_id: app.currentRoomId,
                message: message
            }
        }).done((message) => {
            console.log(message);
            this.getAllByRoom(app.currentRoomId);
        });
    });
}

function getUserName(id) {
    $.ajax({
        url: '/users/' + id,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie("user-token")
        }
    }).done((user) => {
        console.log(user);
    })
}

function getCurrentUser() {
    $.ajax({
        url: '/users/current',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie("user-token")
        }
    }).done((user) => {
        app.userId = user["id"];
    });
}

function enterPassword() {
    app.roomPassword = $('#password').val();
}

function init() {
    getCurrentUser();
}


function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}