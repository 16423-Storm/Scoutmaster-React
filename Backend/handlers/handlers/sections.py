from messageRouting import *

@ws_limit(maxCalls=10, window=60)
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

@ws_limit(maxCalls=10, window=60)
async def handleDeleteSection(
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

    changes = {}

    try:
        result = supabase.rpc(
            "delete_section",
            {
                "p_group_id": group,
                "p_section_id": str(content.get("id")),
                "p_delete_questions": content.get("dq", False)
            }
        ).execute()

        changes = result.data

    except Exception as e:
        print(f"deleteSection failed: {e}")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    deletedSection = groupData[group]["prescout"]["sections"][
        str(content.get("id"))
    ]

    del groupData[group]["prescout"]["sections"][
        str(content.get("id"))
    ]

    if not content.get("dq", False) and changes["target"]:
        target = groupData[group]["prescout"]["sections"][
            changes["target"]
        ]

        if changes["before"]:
            target["questions"] = (
                deletedSection["questions"] +
                target["questions"]
            )
        else:
            target["questions"].extend(
                deletedSection["questions"]
            )

    for changedId, newIndex in changes["indexes"].items():
        groupData[group]["prescout"]["sections"][
            changedId
        ]["index"] = newIndex

    await sendToGroup(
        groups,
        group,
        {
            "type": "deleteSection",
            "content": {
                "indexes": changes["indexes"],
                "del": str(content.get("id")),
                "dq": content.get("dq", False),
                "target": changes["target"],
                "before": changes["before"]
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

@ws_limit(maxCalls=30, window=60)
async def handleUpdateSection(
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

    if not content.get("changes"):
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
            "update_section",
            {
                "p_group_id": group,
                "p_section_id": content.get("id"),
                "p_changes": content.get("changes")
            }
        ).execute()

    except Exception as e:
        print(f"updateSection failed: {e}")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    section = groupData[group]["prescout"]["sections"][content.get("id")]

    section.update(content.get("changes"))

    await sendToGroup(
        groups,
        group,
        {
            "type": "updateSection",
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

@ws_limit(maxCalls=60, window=60)
async def handleUpdateSectionIndexes(
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

    if not content or not content.get("indexes"):
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
            "update_section_indexes",
            {
                "p_group_id": group,
                "p_indexes": content.get("indexes")
            }
        ).execute()

    except Exception as e:
        print(f"updateSectionIndexes failed: {e}")

        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    for section, index in content.get("indexes").items():
        if section in groupData[group]["prescout"]["sections"]:
            groupData[group]["prescout"]["sections"][section]["index"] = index

    await sendToGroup(
        groups,
        group,
        {
            "type": "updateSectionIndexes",
            "content": {
                "indexes": content.get("indexes")
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
