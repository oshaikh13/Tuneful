var hostname, client;

hostname = window.location.hostname;
client   = new BinaryClient('ws://' + hostname + ':' + location.port);

function fizzle(e) {
    e.preventDefault();
    e.stopPropagation();
}

function emit(event, data, file) {
    file       = file || {};
    data       = data || {};
    data.event = event;

    return client.send(file, data);
}
