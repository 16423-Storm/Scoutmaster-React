from messageRouting import *

async def handleAddSection(
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

    section = {}
    sectionId = ""

    try:
        result = supabase.rpc(
            "add_section",
            {
                "p_group_id": group,
                "p_section": {
                    "title": content["title"],
                    "headersize": content["hs"],
                    "questions": []
                }
            }
        ).execute()

        section = {
            "title": content["title"],
            "headersize": content["hs"],
            "questions": [],
            "index": result.data["index"]
        }

        sectionId = str(result.data["id"])
        
    except Exception as e:
        print(f"addSection failed: {e}")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    groupData[group]["prescout"]["sections"][sectionId] = section

    await sendToGroup(
        groups,
        group,
        {
            "type": "addSection",
            "content": {
                "title": content["title"],
                "hs": content["hs"],
                "index": result.data["index"],
                "id": sectionId
            }
        }
    )

    await sendToUser(
        websocket,
        {
            "type": "confirm",
            "requestId": message.get("requestId"),
            "content": True
        }
    )