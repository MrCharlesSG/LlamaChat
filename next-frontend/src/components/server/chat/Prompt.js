
import PromptInput from "@/components/client/chat/PromptInput";
import { promptMessage } from "@/lib/chat-backend-config";

function Prompt({setMessages}) {
  return (
    <div className=" w-full px-8 md:pl-72  fixed bottom-0 right-0 p-2">
      <PromptInput 
        setMessages = {setMessages}
      />
    </div>
  );
}

export default Prompt;
