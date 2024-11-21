const WebSocketInitiator = {
  init(url) {
    const webSocket = new WebSocket(url);
    webSocket.onopen = this._onOpen;
    webSocket.onmessage = this._onMessage;
    webSocket.onclose = this._onClose;
  },

  _onOpen() {
    console.log('WebSocket connection opened');
  },

  _onMessage(event) {
    console.log('WebSocket message received:', event.data);
  },

  _onClose() {
    console.log('WebSocket connection closed');
  },
};

export default WebSocketInitiator;
