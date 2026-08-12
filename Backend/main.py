from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"],
)

app = FastAPI()

groups: dict[int, set[WebSocket]] = {}


@app.get("/")
async def root():
    return {"status": "ok"}

async def getUserGroup(user_id: str):
    result = (
        supabase
        .table("usergroup")
        .select("group_id")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        return None

    groupId = result.data["group_id"]

    group = (
        supabase
        .table("group")
        .select("id, members")
        .eq("id", groupId)
        .single()
        .execute()
    )

    if not group.data:
        return None

    members = group.data["members"] or []

    member = next(
        (
            member
            for member in members
            if member.get("id") == user_id
        ),
        None
    )

    if not member:
        return None

    return {
        "group_id": groupId,
        "member": member,
    }


@app.websocket("/ws")
async def websocketConnect(websocket: WebSocket):
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        return

    try:
        response = supabase.auth.get_user(token)
        user = response.user

        if not user:
            await websocket.close(code=1008)
            return

        userId = user.id

    except Exception as e:
        print("Authentication failed:", e)
        await websocket.close(code=1008)
        return

    group = await getUserGroup(userId)

    if not group:
        await websocket.close(code=1008)
        return

    groupId = group["group_id"]

    await websocket.accept()

    isFirstConnection = (
        groupId not in groups or
        len(groups[groupId]) == 0
    )

    groups.setdefault(groupId, set()).add(websocket)

    print(
        f"User {userId} connected to group {groupId}"
    )

    if isFirstConnection:
        print(
            f"User {userId} is the first connection in group {groupId}"
        )

    try:
        while True:
            message = await websocket.receive_text()

            print(f"{userId}: {message}")

            await websocket.send_text(
                f"Server received: {message}"
            )

    except WebSocketDisconnect:
        print(
            f"Disconnected: {userId} from group {groupId}"
        )

        groups[groupId].discard(websocket)

        if not groups[groupId]:
            del groups[groupId]