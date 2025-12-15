import Button from "../components/button_handler";
import Header from "../components/Header";
import "./Profile.css"
import "../App.css"
import api, { getAccessToken, setAccessToken } from "../api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function Logout(){
    const [sendStatus, setSendStatus] = useState<'none'|'success'|'error'>('none');
    const [serverMessage, setServerMessage] = useState<string>('');
    const [accessFlag, setAccessFlag] = useState<boolean>(false);

    function Reload_Page(){
        window.location.reload();
    }


    useEffect(()=>{
        if(getAccessToken()!=null && getAccessToken()!=''){
            setAccessFlag(true)
        }
        else{
            setAccessFlag(false)
        }
    }, []);
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

        try {
        const response = await api.get(
        "/auth/logout/",
        { headers: { "Content-Type": "application/json" } }
        );
        setAccessToken(null)
        setSendStatus('success');
    } catch (error: any) {
        setSendStatus('error');
        const serverMessage = error.response?.data?.details
        ? Array.isArray(error.response.data.details)
            ? error.response.data.details.join('\n')
            : String(error.response.data.details)
        : error.response?.data?.message || error.message || 'Ошибка при отправке';
        setServerMessage(serverMessage);
        console.error("Ошибка при отправке данных:", error.response?.data || error.message);
    }
    }  


    return(
        <div>
            <Header />
            <main className="content_box">
                {accessFlag && sendStatus=='none'&&
                    <div>
                        <div className="profile_lable_text">Вы уверены, что хотите выйти из аккаунта?</div>
                        <form onSubmit={handleSubmit} noValidate>
                            <Button 
                                type="submit"
                                flag_disabled={false}
                                >Подтвердить</Button>
                        </form>
                    </div>}
                {accessFlag && sendStatus=='success'&&
                    <div>
                        <div className="profile_lable_text" style={{color:"green"}}>Вы успешно вышли из аккаунта</div>
                        <Link to ="/">
                        <Button type={"button"} flag_disabled={false}>
                        На главную
                        </Button>
                        </Link>
                    </div>
                }
                {accessFlag && sendStatus=="error"&&
                    <div>
                        <div className="profile_lable_text" style={{color:"red"}}>Ошибка выхода из профиля: {serverMessage}</div>
                        <Button onClick={() => Reload_Page()} type={"button"} flag_disabled={false}>
                        Заново
                        </Button>
                    </div>
                }
                {!accessFlag && 
                    <div>
                       <div className="profile_lable_text" style={{color:"red"}}>Вы еще не авторизованы</div>
                        <Link to ="/">
                        <Button type={"button"} flag_disabled={false}>
                            На главную
                        </Button>
                        </Link> 
                    </div>
                }
                
            </main>
        </div>
    );
}