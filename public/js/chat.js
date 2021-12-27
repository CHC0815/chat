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
                    ${app.decrypt(message.message)}
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
    encrypt(message) {
        var salt = CryptoJS.lib.WordArray.random(128 / 8);
        var key = CryptoJS.PBKDF2(this.roomPassword, salt, {
            keySize: 256 / 32,
            iterations: 100
        });
        var iv = CryptoJS.lib.WordArray.random(128 / 8);

        var encrypted = CryptoJS.AES.encrypt(message, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        return salt.toString() + iv.toString() + encrypted.toString();
    },
    decrypt(data) {
        var salt = CryptoJS.enc.Hex.parse(data.substr(0, 32));
        var iv = CryptoJS.enc.Hex.parse(data.substr(32, 32));
        var encrypted = data.substring(64);
        var key = CryptoJS.PBKDF2(this.roomPassword, salt, {
            keySize: 256 / 32,
            iterations: 100
        });
        var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}

function getAllByRoom(roomId, limit = 50) {
    $.ajax({
        urL: '/room' + roomId,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie("user-token")
        }
    }).done((data) => {
        app.currentRoomId = roomId;
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
        app.lastDate = null;
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
                message: app.encrypt(message)
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
    app.roomPassword = CryptoJS.SHA256($('#password').val());
    $.ajax({
        url: '/room/' + app.currentRoomId + '/check/' + app.roomPassword,
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie("user-token")
        }
    }).done((respsone) => {
        if (respsone) {
            $('#modal').modal('hide');
            getAllByRoom(app.currentRoomId);
        }
    });
}

function selectRoom(id) {
    app.loadRoom();
    app.currentRoomId = id;
    $('#modal').modal('show');
}

function init() {
    getCurrentUser();
}


function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}