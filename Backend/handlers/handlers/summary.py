from messageRouting import *

@ws_limit(maxCalls=120, window=60)
async def handleUpdateSummary(
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

    changes = content.get("changes")

    if not changes:
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
        supabase.rpc(
            "update_summary",
            {
                "p_group_id": group,
                "p_changes": changes
            }
        ).execute()

    except Exception as e:
        print(f"updateSummary failed: {e}")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    summary = groupData[group].get("summary")

    if summary is None:
        summary = {}
        groupData[group]["summary"] = summary

    summary.update(changes)

    await sendToGroup(
        groups,
        group,
        {
            "type": "updateSummary",
            "content": {
                "changes": changes
            }
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
