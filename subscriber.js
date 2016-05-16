$(function() {
    function subscribe() {
        // это рекурсивная функция
        console.log('subscribe');
        $.ajax({
            url: "http://localhost:9000/subscribe",
            success: function(response) {
                // делаем из ответа полноценный js-объект
                var data = JSON.parse(response);
                // в свойстве uid я храню имя сущности, которое в данный момент
                // является уникальным идентификатором
                // в дальнейшем, например, если игроков - несколько, надо придумать другой
                // уникальный идентификатор
                if (data.uid == "player") {
                    player.x = data.x;
                    player.y = data.y;
                } else if (data.uid == "slime") {
                    slime.x = data.x;
                    slime.y = data.y
                }

                subscribe();
            },
            error: function(err) {
                setTimeout(subscribe, 500)
            }
        })
    }

    subscribe();
})

