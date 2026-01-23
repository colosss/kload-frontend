import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import Confirm from './pages/Confirm.tsx' 
import Profile from './pages/Profile.tsx'
import Post from './pages/Post.tsx'
import Logout from './pages/Logout.tsx'

import Parcticles from './components/parcticls.tsx'

import {BrowserRouter, Route, Routes} from "react-router-dom"

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Parcticles/>
			<link
				href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
				rel="stylesheet"
			></link>
			<Routes>
				<Route path='/' element={<App/>}/>
				<Route path='/login' element ={<Login/>}/>
				<Route path='/register' element={<Register/>}/>
				<Route path='/confirm' element={<Confirm/>}/>
				<Route path='/profile' element={<Profile/>}/>
				<Route path='/post/:id' element={<Post/>}/>
				<Route path='/logout' element={<Logout/>}/>
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
