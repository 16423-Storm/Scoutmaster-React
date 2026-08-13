async def routeMessage(
    websocket: WebSocket,
    id: str,
    message: dict,
):
    type = message.get("type")

    # handler = handlers.get(type)

    # if handler is None:
    #     await websocket.send_json({
    #         "type": "error",
    #         "message": f"Unknown request type: {type}",
    #     })
    #     return

    # await handler(
    #     websocket,
    #     id,
    #     message,
    # )