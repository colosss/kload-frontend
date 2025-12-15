import api from "../api"
import "./post_form.css"
import Button from "./button_handler"
import { useState, useEffect } from "react"


type Post_form_props={
    id:number
}


export default function Delete_post_form(props:Post_form_props){
    const {id}=props
    const [sendStatus, setSendStatus] = useState<'none'|'success'|'error'>('none');
    const [serverMessage, setServerMessage] = useState<string>('');
    console.log(id)
    function Button_click(type: string) {
    console.log("Button clicked", type);
    }
    function ReloadPage(){
        window.location.reload();
    }


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

        try {
        const response = await api.delete(
        `/post/${id}`,
        { headers: { "Content-Type": "application/json" } }
        );
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

            <div className="post_form_box">
                {sendStatus=='none'&&
                <form  onSubmit={handleSubmit} noValidate>
                    <div className="post_lable_text" style={{color:"red"}}>Вы точно хотите удалить пост?</div>
                    <Button onClick={() => Button_click("b")} type={"submit"} flag_disabled={false}>
                        Подтвердить
                    </Button>
                </form>
                }
                

                {sendStatus == 'success' && 
                <div>
                     <div className="post_lable_text" style={{color:"green"}}>{"Пост успешо удалён"}</div>
                     {/* <div className="post_text">Server message: {serverMessage}</div> */}
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
