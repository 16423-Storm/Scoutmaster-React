from messageRouting import *

async def handleAddMatch(
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

    if not content:
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    key = str(content["key"])

    match = {
        "teams": [
            content["red1"],
            content["red2"],
            content["blue1"],
            content["blue2"],
        ],
        "red1": content["red1"],
        "red2": content["red2"],
        "blue1": content["blue1"],
        "blue2": content["blue2"],
        "scores": [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ],
    }

    matchscout = groupData[group]["matchscout"] or {}
    matchscout[key] = match

    try:
        supabase.table("group").update({
            "matchscout": matchscout
        }).eq("id", group).execute()

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

    groupData[group]["matchscout"] = matchscout

    await sendToGroup(
        groups,
        group,
        {
            "type": "addMatch",
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

async def handleAddMatches(
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

    matchscout = {}

    for match in content:
        key = str(match["key"])

        matchscout[key] = {
            "teams": [
                match["red1"],
                match["red2"],
                match["blue1"],
                match["blue2"],
            ],
            "red1": match["red1"],
            "red2": match["red2"],
            "blue1": match["blue1"],
            "blue2": match["blue2"],
            "scores": [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ],
        }

    try:
        updateResult = (
            supabase
                .table("group")
                .update({
                    "matchscout": matchscout
                })
                .eq("id", group)
                .execute()
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

    groupData[group]["matchscout"] = matchscout

    await sendToGroup(
        groups,
        group,
        {
            "type": "addMatches",
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