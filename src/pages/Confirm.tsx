import {useEffect, useState} from "react";
import "./Pages.css";
import Header from "../components/Header";
import {useLocation,useNavigate } from "react-router";
import api from "../api";
import {setAccessToken, getAccessToken} from "../api";
import axios from "axios";



export default function Confirm() {
	const location = useLocation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get("token_pod");
		if (token){
			(async() =>{
				setLoading(true);
				setError(null);
				try {
					const response = await api.get(
						"/auth/registration/confirm/",{
					params: { token_pod: token },
					});
					const newAccess = response.data?.access_token;
					if (newAccess) setAccessToken(newAccess);
					if(getAccessToken()!=null){
						navigate("/");
						return;
					}
				}catch (error: unknown) {
					setError('error');
					let serverMessage = 'Ошибка при отправке';
					if (axios.isAxiosError(error)) {
						const responseData = error.response?.data;
						if (responseData?.details) {
							serverMessage = Array.isArray(responseData.details)
								? responseData.details.join('\n')
								: String(responseData.details);
						} else if (responseData?.message) {
							serverMessage = responseData.message;
						} else if (error.message) {
							serverMessage = error.message;
						}
					} else if (error instanceof Error) {
						serverMessage = error.message;
					} else if (typeof error === 'string') {
						serverMessage = error;
					}
					setError(serverMessage);
					console.error("Ошибка при отправке данных:", error);
					return;
				} finally {
				setLoading(false);  
				}
			})();
		}
	}, [location.search, navigate]);  
	
	return (
		<div>
			<Header />
			<main>
				<div className="content_box">
					<h1 className="content_text"> Подтверждение регистрации</h1>
					<h2 className="content_text"><span className="content_text_root">root@:~$</span> Здесь скоро будет форум</h2>
					<h5>Access token: {getAccessToken()}</h5>
					{loading && <p>Отправка...</p>}
					{error && <p style={{ color: "red" }}>{error}</p>}
				</div>
			</main>
		</div>
	);

}
