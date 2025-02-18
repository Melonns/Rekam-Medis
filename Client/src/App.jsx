import { useState } from 'react'
import cuyLogo from './assets/logo.svg'
import './App.css'
import Header from './Header'
import Footer from './Footer'
import Utama from './Utama'

function App() {
    const [message, setMessage] = useState("");

    return (
        <div className="container">
            <Header />
            <Utama />
        </div>
    )
}

export default App
