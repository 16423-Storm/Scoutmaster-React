from handlers.handlerList import handlers

async def routeMessage(
    websocket: WebSocket,
    id: str,
    message: dict,
):
    messageType = message.get("type")

    handler = handlers.get(messageType)

    if handler is None:
        await websocket.send_json({
            "type": "error",
            "message": f"Unknown request type: {type}",
        })
        return

    await handler(
        websocket,
        id,
        message,
    )