import { Route, Routes } from "react-router"
import { FileProvider } from "./StateManager/FileContext"

// pages
import Home from './pages/Home/Home'

// componants
import Navbar from './componants/Navbar/Navbar'

import './App.css'

function App() {

	return (
		<FileProvider>
			<div className="App">
				<Navbar />
				<Routes>
					<Route path="/" Component={Home} />
				</Routes>
			</div>
		</FileProvider>
	)
}

export default App
