import { supabase } from "../auth";

export async function connectToSession() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return null;
    }

    const accessToken = session.access_token;

    const socket = new WebSocket(`ws://localhost:8000/ws?token=${accessToken}`);

    socket.onopen = () => {
        console.log("Realtime connection established");
    };

    socket.onerror = (error) => {
        console.error("Realtime connection error:", error);
    };

    socket.onclose = (event) => {
        console.log("Realtime connection closed:", event.code, event.reason);
    };

    return socket;
}
