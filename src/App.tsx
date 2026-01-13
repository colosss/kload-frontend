import  { useState, useEffect } from "react";
import "./App.css";
import "./components/button_handler.css";
import Header from "./components/Header";
import {getPosts } from "./api";
import Post_button from "./components/Post_button";
import { Link } from "react-router-dom";
import Page_bar from "./components/Pages_bar";



export default function App() {
	const count_of_simvols=120;
	const limit=5;
	const [lastid, setLastid] = useState<number>(0);
	const [lastIdHistory, setLastIdHistory] = useState<number[]>([0]);
	const [currentPage, setCurrentPage]=useState<number>(1);

	const [content, setContent] = useState<Array<{title:string, body:string, username:string, id:number}>>([]);

	function nextPage() {
		const newLastId = content[content.length - 1]?.id || lastid; 
	
		if (content.length < limit && currentPage > 1) return;

		setLastid(newLastId);
		setLastIdHistory(prev => [...prev, newLastId]);
		setCurrentPage(prev => prev + 1);
	}

	function prevPage() {
		if (currentPage <= 1) return;

		const newHistory = lastIdHistory.slice(0, lastIdHistory.length - 1);
		const prevLastId = newHistory[newHistory.length - 1] || 0;

		setLastid(prevLastId);
		setLastIdHistory(newHistory);
		setCurrentPage(prev => prev - 1);
	}

	useEffect(() => {
		getPosts(limit, lastid)
		.then((data) => {
			if (Array.isArray(data) && data.length > 0) {
			setContent(data);
			} else if (currentPage > 1) {
				prevPage();
			}
		})
		.catch((error) => {
			console.error("Error fetching posts:", error);
		});
	}, [lastid]);
	return (
		<div>
			<Header />
			<main className="content_box">
				{content.map((option, index) => (
					<div className="content_text" key={index}>
						<div className="lable_text" >{option.title}</div>
						<span><img className="image" src="/default.png" alt={"Profile image default.png"}/></span>
						<span style={{color:"red"}}>  {option.username + "@kload: " }</span>
						{option.body.slice(0, count_of_simvols - 3)+"...  "}{<Link to={`/post/${option.id}`}>  {"=>"}перейти к посту</Link>}
					</div>
				))}
				<Page_bar currentPage={currentPage} onNext={nextPage} onPrev={prevPage} isNextDisabled={content.length < limit} isPrevDisabled={currentPage <= 1}/>
			</main>
			<Post_button/>
		</div>
	);
}