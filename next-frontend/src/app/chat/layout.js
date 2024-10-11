import Navigation from "@/components/server/app-navigation/Navigation";
import { ChatProvider } from "@/hooks/useChat";


function ChatLayout({ children }) {

  return (
    <div className=" w-full h-full flex ">
    <ChatProvider>
      <Navigation />
      <div className=" flex-1 pt-14">{children}</div>
      </ChatProvider>
    </div>
  );
}

export default ChatLayout;
