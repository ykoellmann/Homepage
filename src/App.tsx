import './App.css'
import {Tally4} from "lucide-react";
import {HoverButton} from "./components/hover-button.tsx";
import logo from './assets/logo.svg'

function App() {

    return (
        <>
            <div className="header">
                <img src={logo} height="80%"/>
                <HoverButton><Tally4 size={20} className="rotate-90 aspect-square"/></HoverButton>
                Test
            </div>
        </>
    )
}

export default App
