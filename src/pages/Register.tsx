import { useState } from "react";
import "./Pages.css";
import Button from "../components/button_handler";
import "../components/button_handler.css";
import Header from "../components/Header";
import Input from '../components/input';
import api from "../api";
import { Link} from "react-router";
import axios from "axios";


export default function Register() {
	const [sendStatus, setSendStatus] = useState<'none'|'success'|'error'>('none');
	const [serverMessage, setServerMessage] = useState<string>('');


	const [name, setName] = useState<string>("");
	const [login, setLogin] = useState<string>("");

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [password_confirm, setPassword_confirm] = useState<string>("");

	const [flag_name_error, setFlag_name_error] = useState<boolean>(false);
	const [flag_login_error, setFlag_login_error] = useState<boolean>(false);

	const [flag_email_error, setFlag_email_error] = useState<boolean>(false);
	const [flag_password_error, setFlag_password_error] = useState<boolean>(false);
	const [flag_password_confirm_error, setFlag_password_confirm_error] = useState<boolean>(false);

	const [touchedName, setTouchedName] = useState<boolean>(false);
	const [touchedLogin, setTouchedLogin] = useState<boolean>(false);

	const [touchedEmail, setTouchedEmail] = useState<boolean>(false);
	const [touchedPassword, setTouchedPassword] = useState<boolean>(false);
	const [touchedPasswordConfirm, setTouchedPasswordConfirm] = useState<boolean>(false);

	const validateName = (v: string) => v.trim().length >= 4;
	const validateLogin = (v: string) => v.trim().length >= 4;

	const validateEmail = (v: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(v);
	};
	const validatePassword = (v: string) => v.length >= 6; // минимум 6 символов
	const validatePasswordConfirm = (v: string, pass: string) => v === pass && v.length > 0;

	function handleNameChange(v: string) {
		setName(v);
		if (touchedName) setFlag_name_error(!validateName(v));
	}
	function handleLoginChange(v: string) {
		setLogin(v);
		if (touchedLogin) setFlag_login_error(!validateLogin(v));
	}
	function handleEmailChange(v: string) {
		setEmail(v);
		if (touchedEmail) setFlag_email_error(!validateEmail(v));
	}
	function handlePasswordChange(v: string) {
		setPassword(v);
		if (touchedPassword) setFlag_password_error(!validatePassword(v));
		if (touchedPasswordConfirm) {
			setFlag_password_confirm_error(!validatePasswordConfirm(password_confirm, v));
		}
	}
	function handlePasswordConfirmChange(v: string) {
		setPassword_confirm(v);
		if (touchedPasswordConfirm) setFlag_password_confirm_error(!validatePasswordConfirm(v, password));
	}
	function handleNameBlur() {
		setTouchedName(true);
		setFlag_name_error(!validateName(name));
	}
	function handleLoginBlur() {
		setTouchedLogin(true);
		setFlag_login_error(!validateLogin(login));
	}
	function handleEmailBlur() {
		setTouchedEmail(true);
		setFlag_email_error(!validateEmail(email));
	}
	function handlePasswordBlur() {
		setTouchedPassword(true);
		setFlag_password_error(!validatePassword(password));
	}
	function handlePasswordConfirmBlur() {
		setTouchedPasswordConfirm(true);
		setFlag_password_confirm_error(!validatePasswordConfirm(password_confirm, password));
	}
	function Reload_Page(){
		window.location.reload();
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setTouchedName(true);
		setTouchedLogin(true);

		setTouchedEmail(true);
		setTouchedPassword(true);
		setTouchedPasswordConfirm(true);

		const nameInvalid = !validateName(name);
		const loginInvalid = !validateLogin(login);

		const emailInvalid = !validateEmail(email);
		const passwordInvalid = !validatePassword(password);
		const passwordConfirmInvalid = !validatePasswordConfirm(password_confirm, password);

		setFlag_name_error(nameInvalid);
		setFlag_login_error(loginInvalid);

		setFlag_email_error(emailInvalid);
		setFlag_password_error(passwordInvalid);
		setFlag_password_confirm_error(passwordConfirmInvalid);

		if (nameInvalid || emailInvalid || passwordInvalid || passwordConfirmInvalid || loginInvalid) {
			setSendStatus('error');
			setServerMessage('Проверьте поля формы — есть ошибки.');
			console.log("Validation failed, not sending. Flags:", {
				nameInvalid,
				loginInvalid,
				emailInvalid,
				passwordInvalid,
				passwordConfirmInvalid,
			});
			return;
		}
		try {
			await api.post(
			"/auth/registration/",
			{ login:login, username: name, password, email },
			{ headers: { "Content-Type": "application/json" } }
			);
			setSendStatus('success');
		} catch (error: unknown) {
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
			console.error("Ошибка регистрации:", error);
		}
	}


	return (
		<div>

			<Header />

			<main>
				<div className="form_box">
					<div className="form_lable">Регистрация</div>
					{sendStatus!='none' && <div className="info_box">
						{sendStatus === 'success' && (
						<div>
						<div className="form_text" >На вашу почту <span style={{color:"green"}}>{email}</span> было отправлено письмо для подтверждения</div>
							<Link to ="/">
							<Button type={"button"} flag_disabled={false}>
							На главную
							</Button>
							</Link>
						</div>
						)}
						{sendStatus === 'error' && (<div>
						<div className="form_text" style={{color:"red"}}>{serverMessage}</div>
							<Button onClick={() => Reload_Page()} type={"button"} flag_disabled={false}>
							Заново
							</Button>
							</div>
						)}
					</div>}

					<form onSubmit={handleSubmit} noValidate className="form_button_box">
						<Input
						type="text"
						value={login}
						setValue={handleLoginChange}
						flag_error={flag_login_error}
						onBlur={handleLoginBlur}
						touched={touchedLogin}
						errorMessage="Логин должен содержать не менее 4 символов"
						>Логин</Input>

						<Input
						type="text"
						value={name}
						setValue={handleNameChange}
						flag_error={flag_name_error}
						onBlur={handleNameBlur}
						touched={touchedName}
						errorMessage="Имя должно содержать не менее 4 символов"
						>Никнейм</Input>

						<Input
						type="email"
						value={email}
						setValue={handleEmailChange}
						flag_error={flag_email_error}
						onBlur={handleEmailBlur}
						touched={touchedEmail}
						errorMessage="Введите корректный email адрес"
						>Почта</Input>

						<Input
						type="password"
						value={password}
						setValue={handlePasswordChange}
						flag_error={flag_password_error}
						onBlur={handlePasswordBlur}
						touched={touchedPassword}
						errorMessage="Пароль должен содержать не менее 6 символов"
						>Пароль</Input>

						<Input
						type="password"
						value={password_confirm}
						setValue={handlePasswordConfirmChange}
						flag_error={flag_password_confirm_error}
						onBlur={handlePasswordConfirmBlur}
						touched={touchedPasswordConfirm}
						errorMessage="Пароли не совпадают"
						>Подтвердите пароль</Input>
						<Button type={"submit"} flag_disabled={flag_email_error || flag_name_error || flag_password_confirm_error || flag_password_error || (email.length==0) || (name.length==0)||(password.length==0) || (password_confirm.length==0)}>
							Подтвердить
						</Button>
						<Link to ="/login">
							<Button type={"button"} flag_disabled={false}>
							Войти
							</Button>
						</Link>
					</form>
				</div>
			</main>
		</div>
	);

}

