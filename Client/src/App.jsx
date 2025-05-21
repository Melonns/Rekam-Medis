import { useState } from 'react'
import cuyLogo from './assets/logo.svg'
import './App.css'
import Header from './Header'
import Footer from './Footer'
import Utama from './Utama'

function App() {
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="bg-[#E5E7EB] min-h-screen flex flex-col overflow-x-hidden">
            <Header />
            <Utama />
        </div>
        
    )
}

export default App
