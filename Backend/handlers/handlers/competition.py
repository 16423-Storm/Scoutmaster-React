async def handleCompCodeChange(
    websocket: WebSocket,
    id: str,
    message: dict,
    supabase,
    group: int
):
    print("compcodechange"+message.get("content"))
    result = (
        supabase
        .table("group")
        .select("id, members")
        .eq("id", group)
        .single()
        .execute()
    )

    if not result.data:
        return

    members = result.data["members"] or []
    members = result.data["members"] or []
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

    updateResult = (
        supabase
            .table("group")
            .update({"compkey": message.get("content")})
            .eq("id", group)
            .execute()
    )