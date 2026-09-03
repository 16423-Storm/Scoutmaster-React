from fastapi import WebSocket
import functools
import time

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

def ws_limit(maxCalls: int, window: int):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(websocket, id, message, *args, **kwargs):
            if not hasattr(websocket.state, "msg_history"):
                websocket.state.msg_history = {}
            if not hasattr(websocket.state, "violations"):
                websocket.state.violations = {}

            now = time.time()
            action = func.__name__

            history = websocket.state.msg_history.setdefault(action, [])
            
            history = [t for t in history if now - t < window]
            websocket.state.msg_history[action] = history

            if len(history) >= maxCalls:
                violations = websocket.state.violations.get(action, 0) + 1
                websocket.state.violations[action] = violations

                if violations >= 10:
                    await websocket.close(code=1008, reason="Rate limit policy violation")
                    return

                if violations >= 3:
                    return

                msg_type = message.get("type") if isinstance(message, dict) else getattr(message, "type", None)

                await websocket.send_json({
                    "type": "RATELIMITED",
                    "content": msg_type,
                })
                return

            websocket.state.violations[action] = 0
            websocket.state.msg_history[action].append(now)

            return await func(websocket, id, message, *args, **kwargs)

        return wrapper
    return decorator