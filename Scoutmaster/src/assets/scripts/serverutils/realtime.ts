import { supabase } from "../auth";

let socket: WebSocket | null = null;

export async function connectToSession() {
    if (socket?.readyState === WebSocket.OPEN) {
        return socket;
    }

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return null;
    }

    const accessToken = session.access_token;

    socket = new WebSocket(`ws://localhost:8000/ws?token=${accessToken}`);

    socket.onopen = () => {
        console.log("Realtime connection established");
    };

    socket.onerror = (error) => {
        console.error("Realtime connection error:", error);
    };

    socket.onclose = (event) => {
        console.log("Realtime connection closed:", event.code, event.reason);
        socket = null;
    };

    return socket;
}

export function sendMessage(message: object) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket is not connected");
    }

    socket.send(JSON.stringify(message));
}
