import { supabase } from "../auth";

import { hydrate } from "../localstorage";

let socket: WebSocket | null = null;

const pendingRequests = new Map<
    string,
    {
        resolve: (value: boolean) => void;
        reject: (reason?: unknown) => void;
        timeout: ReturnType<typeof setTimeout>;
    }
>();

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

    socket.onmessage = (event) => {
        if (typeof event.data !== "string") {
            console.log("WebSocket non-text message:", event.data);
            return;
        }

        try {
            const message = JSON.parse(event.data);

            console.log("WebSocket JSON message:", message);

            if (message?.type === "confirm") {
                const requestId = message.requestId;

                if (!requestId) {
                    console.error("Confirmation missing requestId");
                    return;
                }

                const pending = pendingRequests.get(requestId);

                if (!pending) {
                    console.warn(`No pending request found for ${requestId}`);
                    return;
                }

                clearTimeout(pending.timeout);
                pendingRequests.delete(requestId);

                pending.resolve(message.content);

                return;
            }

            if (message?.type === "groupHydration") {
                hydrate(
                    message.data.compkey,
                    message.data.custom,
                    message.data.currentTeam,
                    message.data.prescout,
                    message.data.matchscout,
                    message.data.summary,
                );
            }
        } catch {
            console.log("WebSocket text message:", event.data);
        }
    };

    return socket;
}

export function sendMessage(message: {
    type: string;
    content: string | boolean;
    requestId: string;
}): Promise<boolean> {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket is not connected");
    }

    return new Promise<boolean>((resolve, reject) => {
        const timeout = setTimeout(() => {
            pendingRequests.delete(message.requestId);

            reject(new Error(`Request ${message.requestId} timed out`));
        }, 5000);

        pendingRequests.set(message.requestId, {
            resolve,
            reject,
            timeout,
        });

        socket!.send(JSON.stringify(message));
    });
}
