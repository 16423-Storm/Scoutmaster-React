from messageRouting import *

async def handleAddQuestion(
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

    section = ""
    question = ""

    try:
        result = supabase.rpc(
            "add_question",
            {
                "p_group_id": group,
            }
        ).execute()

        section = str(result.data["sId"])
        question = str(result.data["id"])
        
    except Exception as e:
        print(f"addQuestion failed: {e}")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    groupData[group]["prescout"]["sections"][section]["questions"].append(question)
    groupData[group]["prescout"]["structure"][question] = {
        "type": "sn",
        "title": "New Question"
    }

    await sendToGroup(
        groups,
        group,
        {
            "type": "addQuestion",
            "content": {
                "sId": section,
                "id": question
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

async def handleDeleteQuestion(
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

    question = str(
        message.get("content", {}).get("id", "")
    )

    if not question:
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
            "delete_question",
            {
                "p_group_id": group,
                "p_question_id": question
            }
        ).execute()
        
    except Exception as e:
        print(f"deleteQuestion failed: {e}")
        await sendToUser(
            websocket,
            {
                "type": "confirm",
                "requestId": message.get("requestId"),
                "content": False
            }
        )
        return

    groupData[group]["prescout"]["structure"].pop(
        question,
        None
    )

    for section in groupData[group]["prescout"]["sections"].values():
        section["questions"] = [
            questionId
            for questionId in section.get("questions", [])
            if questionId != question
        ]

    await sendToGroup(
        groups,
        group,
        {
            "type": "deleteQuestion",
            "content": {
                "id": question
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
