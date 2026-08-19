from messageRouting import *
import asyncio

async def handleAddTeam(
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

    content = message.get("content")

    prescout = groupData[group]["prescout"]
    prescout["teams"][content["num"]] = {
        "name": content["name"],
        "code": content["code"]
    }

    try:
        updateResult = (
            supabase
                .table("group")
                .update({
                    "prescout": prescout,
                    "custom": True
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

    groupData[group]["custom"] = True

    await sendToGroup(
        groups,
        group,
        {
            "type": "custom",
            "content": True
        },
        exclude=websocket
    )

    groupData[group]["prescout"] = prescout

    await sendToGroup(
        groups,
        group,
        {
            "type": "addTeam",
            "content": content
        },
        exclude=websocket
    )

    await sendToUser(
        websocket,
        {
            "type": "confirm",
            "requestId": message.get("requestId"),
            "content": True
        }
    )

async def handleAddTeams(
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

    content = message.get("content", [])

    prescout = groupData[group]["prescout"]

    prescout["teams"] = {
        str(team["num"]): {
            "name": team["name"],
            "code": team["code"],
            "data": {}
        }
        for team in content
    }

    try:
        result = await asyncio.to_thread(
            lambda: supabase.rpc(
                "update_match_score",
                {
                    "p_group_id": group,
                    "p_match_key": str(content["k"]),
                    "p_alliance": content["a"],
                    "p_question": content["q"],
                    "p_value": content["v"]
                }
            ).execute()
        )
    except Exception as e:
        print("Error sending to supabase:", repr(e))

        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    groupData[group]["prescout"] = prescout

    await sendToGroup(
        groups,
        group,
        {
            "type": "addTeams",
            "content": ""
        },
        exclude=websocket
    )

    await sendToUser(
        websocket,
        {
            "type": "confirm",
            "requestId": message.get("requestId"),
            "content": True
        }
    )