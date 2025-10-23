import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Chat from "./components/chatbot/Chat.tsx"
import Home from "./components/Home.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat otherUser={{ name: "Bob" }} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
