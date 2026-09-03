from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import os
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
import time
import json

from router import routeMessage

load_dotenv()

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"],
)

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groups: dict[int, set[WebSocket]] = {}
groupData: dict[int, dict] = {}


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

async def getGroup(groupId: int):
    result = (
        supabase
        .table("group")
        .select("*")
        .eq("id", groupId)
        .single()
        .execute()
    )

    return result.data

wsConnectionTracker: dict[str, list[float]] = {}
WS_CONNECT_LIMIT = 300
WS_CONNECT_WINDOW = 60

MAX_PAYLOAD_BYTES = 64 * 1024

async def checkPayloadSize(message: dict, websocket: WebSocket) -> bool:
    payloadBytes = len(json.dumps(message).encode("utf-8"))

    if payloadBytes > MAX_PAYLOAD_BYTES:
        await websocket.close(code=1009, reason="Payload size exceeded limit")
        return False
        
    return True

@app.websocket("/ws")
async def websocketConnect(websocket: WebSocket):
    clientIp = websocket.client.host if websocket.client else "unknown"
    now = time.time()

    connectionHistory = wsConnectionTracker.setdefault(clientIp, [])
    wsConnectionTracker[clientIp] = [
        t for t in connectionHistory if now - t < WS_CONNECT_WINDOW
    ]

    if len(wsConnectionTracker[clientIp]) >= WS_CONNECT_LIMIT:
        await websocket.close(code=1008)
        return

    wsConnectionTracker[clientIp].append(now)

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

    userGroup = await getUserGroup(userId)

    if not userGroup:
        await websocket.close(code=1008)
        return

    groupId = userGroup["group_id"]

    if groupId not in groupData:
        groupData[groupId] = await getGroup(groupId)

    group = groupData[groupId]

    await websocket.accept()

    isFirstConnection = (
        groupId not in groups or
        len(groups[groupId]) == 0
    )

    groups.setdefault(groupId, []).append(websocket)

    await websocket.send_json({
        "type": "groupHydration",
        "data": group
    })

    print(
        f"User {userId} connected to group {groupId}"
    )

    if isFirstConnection:
        print(
            f"User {userId} is the first connection in group {groupId}"
        )

    try:
        while True:
            message = await websocket.receive_json()

            if not await checkPayloadSize(message, websocket):
                return

            print(f"{userId}: {message}")


            await routeMessage(
                websocket,
                userId,
                message,
                supabase,
                groupId,
                groupData,
                groups
            )

            await websocket.send_text(
                f"Server received message"
            )

    except WebSocketDisconnect:
        print(
            f"Disconnected: {userId} from group {groupId}"
        )

        if groupId in groups and websocket in groups[groupId]:
            groups[groupId].remove(websocket)

        if not groups[groupId]:
            del groups[groupId]

@app.get("/checkusergroup")
@limiter.limit("10/minute")
async def checkUserGroup(request: Request):
    authHeader = request.headers.get("Authorization")
    token = None

    if authHeader and authHeader.startswith("Bearer "):
        token = authHeader.split(" ")[1]
    else:
        token = request.query_params.get("token")

    if not token:
        return False

    try:
        response = supabase.auth.get_user(token)
        user = response.user

        if not user:
            return False

        result = (
            supabase
            .table("usergroup")
            .select("group_id")
            .eq("id", user.id)
            .maybe_single()
            .execute()
        )

        return result.data is not None

    except Exception as e:
        print(f"Error checking usergroup: {e}")
        return False

@app.get("/join/{groupId}")
async def joinGroup(groupId: int, request: Request):
    authHeader = request.headers.get("Authorization")
    token = None

    if authHeader and authHeader.startswith("Bearer "):
        token = authHeader.split(" ")[1]
    else:
        token = request.query_params.get("token")

    if not token:
        return False

    try:
        response = supabase.auth.get_user(token)
        user = response.user

        if not user or not user.email:
            return False

        userEmail = user.email

        response = (
            supabase
            .table("group")
            .select("id, invited")
            .eq("id", groupId)
            .maybe_single()
            .execute()
        )

        if not response.data:
            return False

        invites = response.data.get("invited") or []

        if userEmail not in invites:
            return False

        supabase.rpc(
            "join_group",
            {
                "p_user_id": user.id,
                "p_group_id": groupId,
                "p_user_email": userEmail,
            }
        ).execute()

        if groupId in groupData:
            if "invited" not in groupData[groupId] or groupData[groupId]["invited"] is None:
                groupData[groupId]["invited"] = []
            if "members" not in groupData[groupId] or groupData[groupId]["members"] is None:
                groupData[groupId]["members"] = []

            groupData[groupId]["invited"][:] = [
                email for email in groupData[groupId]["invited"] if email != userEmail
            ]

            newMember = {
                "id": user.id,
                "email": userEmail,
                "isAdmin": False
            }
            groupData[groupId]["members"].append(newMember)

        removePayload = {
            "type": "deleteInviteForAdd",
            "content": userEmail
        }

        addPayload = {
            "type": "addMember",
            "content": {"id": user.id, "email": userEmail, "isAdmin": False}
        }

        if groupId in groups:
            for connection in list(groups[groupId]):
                await connection.send_json(removePayload)
                await connection.send_json(addPayload)

        return True

    except Exception as e:
        print(f"Error joining group {groupId}: {e}")
        return False

@app.post("/creategroup")
@limiter.limit("1/5minutes")
async def createGroup(request: Request):
    authHeader = request.headers.get("Authorization")
    token = None

    if authHeader and authHeader.startswith("Bearer "):
        token = authHeader.split(" ")[1]
    else:
        token = request.query_params.get("token")

    if not token:
        return {"success": False, "error": "Missing token"}

    try:
        response = supabase.auth.get_user(token)
        user = response.user

        if not user or not user.email:
            return {"success": False, "error": "Invalid user session"}

        rpc_response = supabase.rpc(
            "create_group",
            {
                "p_user_id": user.id,
                "p_user_email": user.email,
            }
        ).execute()

        new_group_id = rpc_response.data

        if not new_group_id:
            return {"success": False, "error": "Failed to generate group ID"}

        groupData[new_group_id] = {
            "members": [
                {
                    "id": str(user.id),
                    "email": user.email,
                    "isAdmin": True
                }
            ],
            "invited": [],
            "compkey": "",
            "custom": {},
            "currentTeam": None,
            "prescout": {},
            "matchscout": {},
            "summary": {}
        }

        if new_group_id not in groups:
            groups[new_group_id] = []

        return {"success": True, "groupId": new_group_id}

    except Exception as e:
        print(f"Error creating group: {e}")
        return {"success": False, "error": str(e)}