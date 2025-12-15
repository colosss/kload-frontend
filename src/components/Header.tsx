import './Header.css'
import './button_handler'
import menu_option from '../assets/menu_option.svg'
import menu_option_active from '../assets/menu_option_active.svg'
import login_icon from '../assets/login_icon.svg'
import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import { getAccessToken, refreshOnce } from "../api";



export default function Header(){
    const [button_flag, setButton_flag] = useState <boolean>(false);
    const [button_icon_flag, setButton_icon_flag] = useState <boolean>(false);

    const [access, setAccess] = useState<string | null>(() => getAccessToken());


    function Button_click(){
        if(!button_flag)setButton_flag(true);
        else setButton_flag(false)
    }
    function Button_icon_click(){
        if(!button_icon_flag)setButton_icon_flag(true);
        else setButton_icon_flag(false)
    }
    const menuButtons = [
        { label: "Профиль", path: "/profile" },
        { label: "Домой", path: "/" }
    ];
    let loginButtons = [
        {label:"Войти", path:"/login"},
        {label:"Регистрация",  path:"/register"}
    ];
    if(access){
        loginButtons=[{label:"Выйти", path:"/logout"}]
    }
    
    
    useEffect(() => {
        let mounted = true;
        
    
        refreshOnce()
        .then((newAccess: string | null) => {
            if (!mounted) return;
            setAccess(newAccess ?? getAccessToken());
        })
        .catch(() => {
            if (mounted) setAccess(getAccessToken());
        });
        return () => { mounted = false; };
    }, []);

    useEffect(()=>{
        loginButtons=[{label:"Выйти", path:"/logout"}]
    },[access]);

    return(
        <header>

            <div className='menu_box'>
                {/* <input type="image" className='menu_option' src = {button_flag? menu_option_active : menu_option} alt={button_flag? 'menu_option_active' : 'menu option'} onClick={()=>Button_click()}/> */}
                <button type="button" onClick = {()=>Button_click()} className='menu_option'>
                    <img src = {button_flag? menu_option_active : menu_option} alt={button_flag? 'menu_option_active' : 'menu option'} className='menu_option_image'/>
                </button>

                {button_flag && (
                    <div className='option_box'>
                        {menuButtons.map((option, index) => (
                            <Link
                                key={index}
                                to={option.path}
                                className="menu_option_item"
                                onClick={() => setButton_flag(false)} // Закрываем меню при клике
                            >
                                {option.label}
                            </Link>
                        ))}
                    </div>
                )}
                {/* <input type="image" className='menu_option' src = {menu_option} alt={'menu option'}/> */}
                    {/* <h1 className='menu_text'>KLoad</h1> */}
                <Link to="/" className='menu_text_button'>
                    KLoad
                </Link>
                <button type="button" onClick = {()=>Button_icon_click()} className='menu_login'>
                    <img src = {button_icon_flag? login_icon : login_icon} alt={button_icon_flag? 'menu_login_active' : 'menu_login_disable'} className='menu_login_image'/>
                </button>
                {button_icon_flag &&
                    <div className='login_box'>
                        {loginButtons.map((option,index)=>(
                            <Link
                            key={index}
                            to={option.path}
                            className={access?'menu_logout_item':'menu_option_item'}
                            onClick={()=>setButton_icon_flag(false)}>
                                {option.label}
                            </Link>
                        ))}
                    </div>}
            </div>
        </header>
    )
}