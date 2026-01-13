import api from "../api";
import { useState } from "react";
import "./Pages.css";
import Button from "../components/button_handler";
import "../components/button_handler.css";
import Header from "../components/Header";
import Input from '../components/input';
import { Link } from "react-router";
import { setAccessToken} from "../api";
import axios from "axios";

export default function Login() {
	const [sendStatus, setSendStatus] = useState<'none'|'success'|'error'>('none');
	const [serverMessage, setServerMessage] = useState<string>('');

	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [flag_name_error, setFlag_name_error] = useState<boolean>(false);
	const [flag_password_error, setFlag_password_error] = useState<boolean>(false);

	const [touchedName, setTouchedName] = useState<boolean>(false);
	const [touchedPassword, setTouchedPassword] = useState<boolean>(false);

	const validateName = (v: string) => v.trim().length >= 3; // минимум 3 символов
	const validatePassword = (v: string) => v.length >= 6; // минимум 6 символов

	const [disableFlag, setDisableFlag]= useState<boolean>(false)

	function handleNameChange(v: string) {
		setName(v);
		if (touchedName) setFlag_name_error(!validateName(v));
	}
	function handlePasswordChange(v: string) {
		setPassword(v);
		if (touchedPassword) setFlag_password_error(!validatePassword(v));
	}
	function handleNameBlur() {
		setTouchedName(true);
		setFlag_name_error(!validateName(name));
	}
	function handlePasswordBlur() {
		setTouchedPassword(true);
		setFlag_password_error(!validatePassword(password));
	}
	function Button_click(type: string) {
		console.log("Button clicked", type);
		console.log("name:", name);
		console.log("password:", password);
	}

	function Reload_Page(){
		window.location.reload();
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setTouchedName(true);
		setTouchedPassword(true);

		const nameInvalid = !validateName(name);
		const passwordInvalid = !validatePassword(password);

		setFlag_name_error(nameInvalid);
		setFlag_password_error(passwordInvalid);

		setDisableFlag(true);

		if (nameInvalid || passwordInvalid) {
			console.log("Validation failed, not sending. Flags:", {
				nameInvalid,
				passwordInvalid,
			});
			return;
		}

		const params = new URLSearchParams();
		params.append("username", name);
		params.append("password", password);
		params.append("grant_type", "password");
		try {
			const response = await api.post(
				"/auth/token/",
				params.toString(),
				{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				}
			);
			const newAccess = response.data?.access_token;
			if (newAccess) setAccessToken(newAccess);
			setSendStatus('success');

		}catch (error: unknown) {
            setSendStatus('error');
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

            setServerMessage(serverMessage);
            console.error("Ошибка авторизации:", error);
        }
	}

  	return (
		<div>
			<Header />
			<main>
				<div className="form_box">
				<div className="form_lable">Авторизация</div>
				{sendStatus!='none' && <div className="info_box">
					{sendStatus === 'success' && (
						<div>
						<div className="form_text" >Вы вошли в аккаунт <span style={{color:"green"}}>{name}</span></div>
							<Link to ="/">
							<Button onClick={() => Button_click("b")} type={"button"} flag_disabled={false}>
							На главную
							</Button>
							</Link>
						</div>
					)}
					{sendStatus === 'error' && (
						<div>
							<div className="form_text" style={{color:"red"}}>{serverMessage}</div>
							<Button onClick={() => Reload_Page()} type={"button"} flag_disabled={false}>
							Заново
							</Button>
						</div>
					)}
				</div>}
				<form onSubmit={handleSubmit} noValidate className="form_button_box">

					<Input
					type="username"
					value={name}
					setValue={handleNameChange}
					flag_error={flag_name_error}
					onBlur={handleNameBlur}
					touched={touchedName}
					disableFlag={disableFlag}
					errorMessage="Имя должно содержать не менее 3 символов"
					>Логин</Input>

					<Input
					type="password"
					value={password}
					setValue={handlePasswordChange}
					flag_error={flag_password_error}
					onBlur={handlePasswordBlur}
					touched={touchedPassword}
					disableFlag={disableFlag}
					errorMessage="Пароль должен содержать не менее 6 символов"
					>Пароль</Input>

					<Button onClick={() => Button_click("b")} type={"submit"} flag_disabled={flag_name_error || flag_password_error || (name.length==0)|| (password.length==0)}>
					Подтвердить
					</Button>
					<Link to="/register">
					<Button onClick={() => Button_click("b")} type={"button"} flag_disabled={false}>
						Зарегистрироваться
					</Button>
					</Link>
				</form>
				</div>
			</main>
		</div>
	);
}