// этот файл работает на сервере, отслеживает новых клиентов
// и прорисовку координат

var clients = [];

// этот метод добавляет новых клиентов в массив clients при подключении
// а также удаляет их оттуда, если юзер закрыл браузер
exports.subscribe = function(request, response) {
    console.log('subscribe');
    clients.push(response);

    response.on("close", function() {
        clients.splice(clients.indexOf(response), 1);
    })
}

// это, соответственно, перерисовка
// когда я отправляю координаты со своего клиента
// они транслируются всем пользователям,
// далее клиентский скрипт, который я написал на jQuery просто
// подставляет нужные координаты (см. файл subscriber.js, эта подстановка происходит там)
exports.redraw = function(name, x, y) {

    clients.forEach(function(response) {
        response.end(JSON.stringify({
            uid: name,
            x: x,
            y: y
        }));
    });

    clients = [];
}

setInterval(function() {
    console.log('clients=',clients.length);
}, 2000)

