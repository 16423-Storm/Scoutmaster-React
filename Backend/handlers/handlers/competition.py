async def handleCompCodeChange(
    websocket: WebSocket,
    id: str,
    message: dict,
):
    print("compcodechange"+message.get("content"))