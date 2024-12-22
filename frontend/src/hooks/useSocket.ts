import { useEffect, useState } from "react"
const WS_URL ="wss://chess-dev-production.up.railway.app"
export const useSocket = ()=>{
    const [socket, setSocket]=useState<WebSocket |null>(null);
    useEffect(()=>{ 
        const ws = new WebSocket(WS_URL);
        ws.onopen=()=>{
            console.log("working")
            setSocket(ws);
            console.log("working....")
        }
        ws.onclose=()=>{
            
            setSocket(null);
        }
        return ()=>{
            ws.close();
        }
        

    },[])
    return socket;
}