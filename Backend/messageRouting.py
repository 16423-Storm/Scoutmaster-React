from fastapi import WebSocket

async def sendToUser(
    websocket: WebSocket,
    message: dict
):
    await websocket.send_json(message)


async def sendToGroup(
    groups: dict[int, set[WebSocket]],
    groupId: int,
    message: dict,
    exclude: WebSocket | None = None
):
    connections = groups.get(groupId, set()).copy()

    for connection in connections:
        if connection == exclude:
            continue

        try:
            await connection.send_json(message)
        except Exception as e:
            print(f"Failed to send to connection: {e}")