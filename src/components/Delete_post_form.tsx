import api from "../api"
import "./post_form.css"
import Button from "./button_handler"
import { useState } from "react"
import axios from "axios"

type Post_form_props={
    id:number
}

export default function Delete_post_form(props:Post_form_props){
    const {id}=props
    const [sendStatus, setSendStatus] = useState<'none'|'success'|'error'>('none');
    const [serverMessage, setServerMessage] = useState<string>('');
    function ReloadPage(){
        window.location.reload();
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await api.delete(
            `/post/${id}`,
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
            console.error("Ошибка при отправке данных:", error);
        }
    }
    return(

            <div className="post_form_box">
                {sendStatus=='none'&&
                <form  onSubmit={handleSubmit} noValidate>
                    <div className="post_lable_text" style={{color:"red"}}>Вы точно хотите удалить пост?</div>
                    <Button type={"submit"} flag_disabled={false}>
                        Подтвердить
                    </Button>
                </form>
                }

                {sendStatus == 'success' && 
                <div>
                    <div className="post_lable_text" style={{color:"green"}}>{"Пост успешо удалён"}</div>
                    <Button onClick={() => ReloadPage()} type={"submit"} flag_disabled={false}>
                        Ок
                    </Button>
                </div>
                }

                {sendStatus == 'error' && 
                <div>
                    <div className="post_lable_text" style={{color:"red"}}>Ошибка удаления поста</div>
                    <div className="post_text" >Возможно у вас нехватает прав удалять пост</div>
                    <div className="post_text">Server message: {serverMessage}</div>
                    <Button onClick={() => ReloadPage()} type={"submit"} flag_disabled={false}>
                        Ок
                    </Button>
                </div>
                }

            </div>
    )
}
