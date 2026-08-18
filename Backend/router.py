from handlers.handlerList import handlers
from fastapi import WebSocket

async def routeMessage(
    websocket: WebSocket,
    id: str,
    message: dict,
    supabase,
    group: int,
    groupData,
    groups
):
    messageType = message.get("type")

    handler = handlers.get(messageType)

    if handler is None:
        await websocket.send_json({
            "type": "error",
            "message": f"Unknown request type: {messageType}",
        })
        return

    await handler(
        websocket,
        id,
        message,
        supabase,
        group,
        groupData,
        groups
    )
