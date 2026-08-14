async def handleCompCodeChange(
    websocket: WebSocket,
    id: str,
    message: dict,
    supabase,
    group: int,
    groupData
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
        return
    
    isAdmin = member.get("isAdmin", False)

    if not isAdmin:
        print(f"User {id} is not an admin")
        return

    try:
        updateResult = (
            supabase
                .table("group")
                .update({
                    "compkey": message.get("content")
                })
                .eq("id", group)
                .execute()
        )
    except:
        print("Error sending to supabase")
        return

    groupData[group]["compkey"] = message.get("content")
    

async def handleCustom(
    websocket: WebSocket,
    id: str,
    message: dict,
    supabase,
    group: int,
    groupData
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
        return
    
    isAdmin = member.get("isAdmin", False)

    if not isAdmin:
        print(f"User {id} is not an admin")
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
        return

    groupData[group]["custom"] = message.get("content")