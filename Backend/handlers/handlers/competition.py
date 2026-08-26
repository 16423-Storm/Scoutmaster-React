from messageRouting import *

async def handleCompCodeChange(
    websocket: WebSocket,
    id: str,
    message: dict,
    supabase,
    group: int,
    groupData,
    groups
):
    members = groupData[group]["members"] or []
    member = next(
        (
            member
            for member in members
            if member.get("id") == id
        ),
        None
    )

    if not member:
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return
    
    isAdmin = member.get("isAdmin", False)

    if not isAdmin:
        print(f"User {id} is not an admin")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    setPrescout = {
        "teams": {},
        "structure": {},
        "sections": {
            "0": {
                "title": "Section 1",
                "headersize": 1,
                "questions": [],
                "index": 0,
            },
        },
    }

    setPrescout["sections"] = groupData[group]["prescout"]["sections"]
    setPrescout["structure"] = groupData[group]["prescout"]["structure"]

    try:
        updateResult = (
            supabase
                .table("group")
                .update({
                    "compkey": message.get("content"),
                    "custom": False,
                    "prescout": setPrescout,
                    "currentTeam": groupData[group]["currentTeam"],
                    "matchscout": {},
                    "summary": {
                        "picks": [],
                        "accept": [],
                        "reject": [],
                        "currentPos": 0
                    }
                })
                .eq("id", group)
                .execute()
        )
    except Exception as e:
        print("Error sending to supabase:",repr(e))
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    await sendToUser(
        websocket,
        {
            "type": "confirm",
            "requestId": message.get("requestId"),
            "content": True
        }
    )

    groupData[group]["compkey"] = message.get("content")
    groupData[group]["prescout"] = setPrescout
    groupData[group]["custom"] = False

    await sendToGroup(
        groups,
        group,
        {
            "type": "compCodeChange",
            "content": message.get("content")
        },
        exclude=websocket
    )
    

async def handleCustom(
    websocket: WebSocket,
    id: str,
    message: dict,
    supabase,
    group: int,
    groupData,
    groups
):
    members = groupData[group]["members"] or []
    member = next(
        (
            member
            for member in members
            if member.get("id") == id
        ),
        None
    )

    if not member:
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return
    
    isAdmin = member.get("isAdmin", False)

    if not isAdmin:
        print(f"User {id} is not an admin")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    try:
        updateResult = (
            supabase
                .table("group")
                .update({
                    "custom": message.get("content")
                })
                .eq("id", group)
                .execute()
        )
    except:
        print("Error sending to supabase")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    groupData[group]["custom"] = message.get("content")

    await sendToUser(
        websocket,
        {
            "type": "confirm",
            "requestId": message.get("requestId"),
            "content": True
        }
    )

    await sendToGroup(
        groups,
        group,
        {
            "type": "custom",
            "content": message.get("content")
        },
        exclude=websocket
    )