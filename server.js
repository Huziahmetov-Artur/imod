const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const path = require('path');
app.use(express.static(__dirname + '/dist/'));

function createMessage(content, isBroadcast = false, sender = 'NS') {
	return JSON.stringify({
		content,
		isBroadcast,
		sender
	});
}

wss.on('connection', (ws) => {
	ws.on('message', (msg) => {
		const message = JSON.parse(msg);
		setTimeout(() => {
			ws.send(createMessage(`Your Message -> ${message.content}`, message.isBroadcast));
		}, 1000);
	});

	ws.send(createMessage('WebSocket server'));

	ws.on('error', (err) => {
		console.warn(`Client disconnected ${err}`);
	});
});

server.listen(process.env.PORT || 8080, () => {
	console.log(`Server started on port ${server.address().port}`);
});

app.get('/*', function(req, res) {
	res.sendFile(path.normalize(__dirname + '/dist/index.html'));
});
