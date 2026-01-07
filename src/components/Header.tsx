import './Header.css';
import menu_option from '../assets/menu_option.svg';
import menu_option_active from '../assets/menu_option_active.svg';
import login_icon from '../assets/login_icon.svg';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate если нужен logout
import { useState, useEffect, useRef } from 'react';
import { getAccessToken, refreshOnce } from "../api";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginMenuOpen, setLoginMenuOpen] = useState(false);
    const [access, setAccess] = useState<string | null>(() => getAccessToken());

    // Ссылки на DOM-элементы кнопок и меню для проверки клика вне их
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const loginButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const loginMenuRef = useRef<HTMLDivElement>(null);

    // Закрытие меню при клике вне его
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }

            if (
                loginMenuRef.current && !loginMenuRef.current.contains(event.target as Node) &&
                loginButtonRef.current && !loginButtonRef.current.contains(event.target as Node)
            ) {
                setLoginMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuButtons = [
        { label: "Профиль", path: "/profile" },
        { label: "Домой", path: "/" }
    ];

    const loginButtons = access
        ? [{ label: "Выйти", path: "/logout" }]
        : [
            { label: "Войти", path: "/login" },
            { label: "Регистрация", path: "/register" }
        ];

    useEffect(() => {
        let mounted = true;
        refreshOnce()
            .then((newAccess: string | null) => {
                if (mounted) {
                    setAccess(newAccess ?? getAccessToken());
                }
            })
            .catch(() => {
                if (mounted) setAccess(getAccessToken());
            });
        return () => { mounted = false };
    }, []);

    return (
        <header>
            <div className='menu_box'>
                {/* Кнопка основного меню */}
                <button
                    type="button"
                    ref={menuButtonRef}
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                        if (loginMenuOpen) setLoginMenuOpen(false); // закрываем второе меню
                    }}
                    className='menu_option'
                >
                    <img
                        src={menuOpen ? menu_option_active : menu_option}
                        alt="menu option"
                        className='menu_option_image'
                    />
                </button>

                {/* Выпадающее основное меню */}
                {menuOpen && (
                    <div ref={menuRef} className='option_box'>
                        {menuButtons.map((option, index) => (
                            <Link
                                key={index}
                                to={option.path}
                                className="menu_option_item"
                                onClick={() => setMenuOpen(false)} // закрываем при выборе
                            >
                                {option.label}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Логотип */}
                <Link to="/" className='menu_text_button'>
                    KLoad
                </Link>

                {/* Кнопка логина */}
                <button
                    type="button"
                    ref={loginButtonRef}
                    onClick={() => {
                        setLoginMenuOpen(!loginMenuOpen);
                        if (menuOpen) setMenuOpen(false); // закрываем первое меню
                    }}
                    className='menu_login'
                >
                    <img
                        src={login_icon}
                        alt="login"
                        className='menu_login_image'
                    />
                </button>

                {/* Выпадающее меню логина */}
                {loginMenuOpen && (
                    <div ref={loginMenuRef} className='login_box'>
                        {loginButtons.map((option, index) => (
                            <Link
                                key={index}
                                to={option.path}
                                className={access ? 'menu_logout_item' : 'menu_option_item'}
                                onClick={() => setLoginMenuOpen(false)}
                            >
                                {option.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}