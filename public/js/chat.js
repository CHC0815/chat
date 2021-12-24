var app = {
    messages: [],
    currentRoomId: null,
    lastDate: null,
    roomPassword: null,
    userId: null,

    loadRoom() {
        this.messages = [];
        var container = document.querySelector("#messages");
        container.innerHTML = "";
    },

    addMessage(message) {
        this.messages.push(message);
        ajax_get('/users/' + message.sender_id, {}, function (user) {
            user = JSON.parse(user);
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

function getAllByRoom(roomId) {
    ajax_get('/room/' + roomId, {}, function (data) {
        var name = JSON.parse(data)["name"];
        document.querySelector("#roomName").innerHTML = name;
        document.querySelector("#roomImage").setAttribute("src", `https://eu.ui-avatars.com/api/?name=${name}`);
    });
    ajax_get('/messages/' + roomId, {}, function (messages) {
        app.currentRoomId = roomId;
        app.lastDate = null;
        app.loadRoom();
        messages = JSON.parse(messages);
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
    ajax_get('/users/current', {}, function (user) {
        var sender_id = JSON.parse(user)["id"];
        var message = document.querySelector("#message").value;
        if (!message || message.length == 0) {
            return;
        }
        ajax_post('/message/send', {
            sender_id: sender_id,
            room_id: app.currentRoomId,
            message: message
        }, function (message) {
            console.log(message);
            this.getAllByRoom(app.currentRoomId);
        });
    });
}

function getUserName(id) {
    ajax_get('/users/' + id, {}, function (user) {
        console.log(user);
    });
}

function getCurrentUser() {
    ajax_get('/users/current', {}, function (user) {
        app.userId = JSON.parse(user)["id"];
    });
}

function init() {
    getCurrentUser();
}

function ajax_get(url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax_base(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
}

function ajax_post(url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax_base(url, callback, 'POST', query.join('&'), async);
}

function ajax_base(url, callback, method, data, async) {
    if (async ===undefined) {
        async = true;
    }
    var x = new XMLHttpRequest();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4 && x.status == 200) {
            callback(x.responseText);
        }
    }
    if (method == "POST") {
        x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    if (getCookie("user-token") != null) {
        x.setRequestHeader('Authorization', 'Bearer ' + getCookie("user-token"));
    } else {
        console.log(getCookie("user-token"));
    }

    x.send(data);
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}