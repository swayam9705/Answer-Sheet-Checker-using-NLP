import { Route, Routes } from "react-router"

// pages
import Home from './pages/Home/Home'

// componants
import Navbar from './componants/Navbar/Navbar'

import './App.css'

function App() {

	return (
		<div className="App">
			<Navbar />
			<Routes>
				<Route path="/" Component={Home} />
			</Routes>
		</div>
	)
}

export default App
