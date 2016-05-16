var http = require("http");
var server = http.createServer();
var canvas = require("./canvas");

var port = 9000;
var ip = "127.0.0.1"; // это может быть и алиас, если таковой прописан в вашем файле HOSTS

server.listen(port, ip);

server.on("request", function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')

    console.log(request.method, response.statusCode, request.url)  
    switch(request.url) {
        case '/subscribe' :
            canvas.subscribe(request, response);
            break;

        case '/redraw' :
            var body = "";
            // пока request содержит какие-то данные - считываем их
            request.on("readable", function() {
                body += request.read();
            })

            // когда уже нечего считывать - парсим в JSON и выводим
            request.on("end", function() {
                try {
                    body = JSON.parse(body);
                    canvas.redraw(body.uid, body.x, body.y)
                } catch (e) {
                    response.end(JSON.stringify(body));
                }

                response.end()
            })
            break;

        default:
            response.end();
            break;
    }

})
