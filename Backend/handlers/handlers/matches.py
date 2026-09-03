from messageRouting import *
import asyncio

@ws_limit(maxCalls=40, window=60)
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

    matchscout = groupData[group]["matchscout"] or {}
    if len(matchscout) >= 750:
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

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

    try:
        response = supabase.rpc(
            "add_match",
            {
                "p_group_id": group,
                "p_match": match,
            }
        ).execute()

        generatedKey = str(response.data)

    except Exception:
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    matchscout[generatedKey] = match
    groupData[group]["matchscout"] = matchscout

    content["k"] = generatedKey

    await sendToGroup(
        groups,
        group,
        {
            "type": "addMatch",
            "content": content
        },
    )

    await sendToUser(
        websocket,
        {
            "type": "confirm",
            "requestId": message.get("requestId"),
            "content": True
        }
    )
    
@ws_limit(maxCalls=8, window=60)
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

@ws_limit(maxCalls=500, window=60)
async def handleUpdateScore(
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

    print(group)

    try:
        result = await asyncio.to_thread(
            lambda: supabase.rpc(
                "update_match_score",
                {
                    "p_group_id": group,
                    "p_match_key": str(content["k"]),
                    "p_alliance": content["a"],
                    "p_question": content["q"],
                    "p_value": content["v"],
                    "p_counter": content["c"],
                }
            ).execute()
        )

        score = result.data

        groupData[group]["matchscout"][str(content["k"])]["scores"][content["a"]][content["q"]] = score

        await sendToGroup(
            groups,
            group,
            {
                "type": "updateScore",
                "content": {
                    "k": content["k"],
                    "a": content["a"],
                    "q": content["q"],
                    "v": score,
                }
            },
            exclude=websocket
        )

    except Exception as e:
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

@ws_limit(maxCalls=40, window=60)
async def handleDeleteMatch(
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

    try:
        supabase.rpc(
            "delete_match",
            {
                "p_group_id": group,
                "p_match_key": key,
            }
        ).execute()

    except Exception:
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    print("The key is:", groupData[group]["matchscout"][str(key)])
    groupData[group]["matchscout"].pop(str(key), None)

    await sendToGroup(
        groups,
        group,
        {
            "type": "deleteMatch",
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
   