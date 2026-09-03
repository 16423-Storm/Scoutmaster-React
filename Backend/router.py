from handlers.handlerList import handlers
from handlers.schemas import WebSocketIncomingMessage
from fastapi import WebSocket
from pydantic import TypeAdapter, ValidationError

adapter = TypeAdapter(WebSocketIncomingMessage)

async def routeMessage(
    websocket: WebSocket,
    id: str,
    message: dict,
    supabase,
    group: int,
    groupData,
    groups
):
    try:
        validatedMsg = adapter.validate_python(message)
    except ValidationError as e:
        await websocket.send_json({
            "type": "error",
            "message": "Invalid message format",
            "details": e.errors(include_url=False, include_context=False)
        })
        return

    messageType = validatedMsg.type
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
        validatedMsg.model_dump(),
        supabase,
        group,
        groupData,
        groups
    )