import './App.css'
import {ArrowLeft, ArrowRight, Tally4} from "lucide-react";
import {HoverButton} from "./components/hover-button.tsx";
import logo from './assets/logo.svg'

function App() {

    return (
        <>
            <div className="header gap-2">
                <img src={logo} height="80%"/>
                <HoverButton><Tally4 size={20} className="rotate-90 aspect-square"/></HoverButton>
                <HoverButton><ArrowLeft  size={20} className="aspect-square"/></HoverButton>
                <HoverButton><ArrowRight  size={20} className="aspect-square"/></HoverButton>
                <HoverButton>
                    Yannik Köllmann
                </HoverButton>
            </div>
        </>
    )
}

export default App
