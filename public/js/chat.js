var app = {
    messages: [],


    addMessage(message) {
        this.messages.push(message);

        var sender = "you";

        var container = document.querySelector("#messages");
        var msg = document.createElement("div");
        msg.classList.add("chat-message-right");
        msg.classList.add("pb-4");
        var msg_inner = `
            <div>
                <img src="https://eu.ui-avatars.com/api/?name=${sender}"
                    class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
                    <div class="text-muted small text-nowrap mt-2">${message.createdAt}</div>
                </div>
                <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                <div class="font-weight-bold mb-1">${sender}</div>
                ${message.message}
            </div>
        `;
        msg.innerHTML = msg_inner;
        container.appendChild(msg);
    }
}

function loadRoom(id) {
    ajax_get('/room/' + id, {}, function (data) {

    });
}

function loadMessages(roomId) {
    ajax_get('/messages/' + roomId, {}, function (messages) {
        messages = JSON.parse(messages);
        messages.forEach((message) => {
            app.addMessage(message);
        });
    });
}

function sendMessage() {
    ajax_get('/users/current', {}, function (user) {
        var sender_id = JSON.parse(user)["id"];
        var room_id = 1;
        var message = "Hello Wolrd";
        ajax_post('/message/send', {
            sender_id: sender_id,
            room_id: room_id,
            message: message
        }, function (message) {
            console.log(message);
        });
    });
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