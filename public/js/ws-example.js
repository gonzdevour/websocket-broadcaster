(function ($) {
    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host+"/"+ new Date().getTime());
    console.log("WS", ws);
    ws.onmessage = function (event) {
        var li = document.createElement('li');
        li.innerHTML = JSON.parse(event.data);
        document.querySelector('#pings').appendChild(li);
    };

    $(function(){
        $('form').submit(function(ev){
            ev.preventDefault();
            var $message = $('input#msg');
            console.log("sending", $message.val());
            ws.send($message.val());
            $message.val("");
        });
    });
})(jQuery);
