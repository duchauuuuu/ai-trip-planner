"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDaysUi from "./SelectDaysUi";
import FinalUi from "./FinalUi";

type Message = {
  role: string;
  content: string;
  ui?: string
};
type TripInfo ={
  
}
const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isFinal,setIsFinal] = useState<boolean>(false);
  const [tripDetail,setTripDetail] = useState();
  const onSend = async () => {
    if (!userInput?.trim()) return;
    setLoading(true);
    
    
    const newMsg: Message = {
      role: "user",
      content: userInput ?? '',
    };
    setUserInput("");
    setMessages((prev: Message[]) => [...prev, newMsg]);

    const result = await axios.post("/api/aimodel", {
      messages: [...messages, newMsg],
      isFinal: isFinal,
    });
    console.log("trip", result.data);
    
    !isFinal && setMessages((prev:Message[])=>[...prev,{
      role: "assistant",
      content: result?.data?.resp,
      ui:result?.data?.ui
    }]);
    if(isFinal){
      setTripDetail(result?.data?.trip_plan);
    }
    
    setLoading(false);
  };
  const RenderGenerativeUi = (ui: string) =>{
    if(ui==='budget'){
return <BudgetUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>
    }
    else if(ui==='groupSize'){
        return <GroupSizeUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>
    }
    else if(ui==='tripDuration'){
        return <SelectDaysUi onSelectedOption={(v:string)=>{setUserInput(v);onSend()}}/>
    }
    else if(ui==='final'){
      return <FinalUi viewTrip={()=>console.log()}
      disable={!tripDetail} />
    }
    return null;
  } 
  useEffect(()=>{
    const lastMsg = messages[messages.length - 1];
    if(lastMsg?.ui=='final'){
      setIsFinal(true);
      setUserInput('OK, GREAT!')
     
    }
  },[messages])

  useEffect(()=>{
     if(isFinal && userInput){
      onSend();
     }
  },[isFinal])
  return (
    <div className="h-[85vh] flex flex-col ">
      {messages?.length === 0 && <EmptyBoxState onSelectOption={(v:string)=>{setUserInput(v); onSend()}}/>}
      {/* display message */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg:Message, index)=>(
          msg.role === 'user' ? 
            <div className="flex justify-end mt-2" key={index}>
          <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg">
            {msg.content}
          </div>
        </div>
        :
        <div className="flex justify-start mt-2" key={index}>
          <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
            { msg.content}
            {RenderGenerativeUi(msg.ui??'')}
          </div>
        </div>
        ))}
      {loading && <div className="flex justify-start mt-2" >
          <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
           <Loader className="animate-spin"/>
          </div>
        </div>}
      </section>
      {/* user input */}
      <section>
        <div className="relative border rounded-2xl p-4">
          <Textarea
            placeholder="Start typing your message..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0
                shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
          ></Textarea>
          <Button
            size={"icon"}
            className="absolute bottom-6 right-6"
            onClick={() => onSend()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;
