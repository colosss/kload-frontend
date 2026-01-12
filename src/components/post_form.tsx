import api from "../api"
import "./post_form.css"
import Button from "./button_handler"
import { useState, useEffect } from "react"
import axios from "axios"

type Post_form_props={
    tema?:string | string[],
    telo?:string | string[],
    put?:boolean, 
    id?:number
}

export default function Post_form({tema, telo, put, id}:Post_form_props){
    const [title, setTitle]= useState<string| string[]>('');
    const [post, setPost]= useState<string | string[]>('');
    const [sendStatus, setSendStatus] = useState<'none'|'success'|'error'>('none');
    const [serverMessage, setServerMessage] = useState<string>('');

    function ReloadPage(){
        window.location.reload();
    }

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setTitle(event.target.value);
    }
    function handlePostChange(event:React.ChangeEvent<HTMLTextAreaElement>) {
        setPost(event.target.value);
    }
    async function handleSubmit_put(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const titleStr = Array.isArray(title) ? title.join("\n") : title;
        const bodyStr  = Array.isArray(post)  ? post.join("\n")  : post;

        try {
            await api.put(
            "/post/"+id,
            { title: titleStr, body:bodyStr},
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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

        try {
            await api.post(
            "/post/",
            { title: title, body:post },
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

    useEffect(() => {
        if(tema)setTitle(tema)
        if(telo)setPost(telo)
    }, [tema, telo]);

    return(
        <div className="post_form_box">
            {sendStatus=='none'&&
            <form  onSubmit={!put?handleSubmit:handleSubmit_put} noValidate>
                <div className="post_lable_text">{!put?"Форма создания постов":"Форма редактирования поста"}</div>
                <div className="post_text">Тема: </div>
                <input
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={75}
                    placeholder="Тема поста..."
                    className="title_area"/>
                <div className="post_text"> Пост: </div>
                <textarea
                    value={post}
                    onChange={handlePostChange}
                    maxLength={10000}
                    autoCorrect="on"
                    placeholder="Тело поста..."
                    spellCheck="true"
                    className="post_area"/>
                <Button type={"submit"} flag_disabled={(title.length==0) || (post.length==0)}>
                    Подтвердить
                </Button>
            </form>}
            
            {sendStatus == 'success' && 
            <div>
                <div className="post_lable_text">{put?"Пост успешно отредактирован":"Пост успешо создан"}</div>
                <Button onClick={() => ReloadPage()} type={"submit"} flag_disabled={(title.length==0) || (post.length==0)}>
                    Ок
                </Button>
            </div>
            
            
            }

            {sendStatus == 'error' &&
                <div>
                    <div className="post_lable_text">Ошибка отправки поста</div>
                    <div className="post_text">Server message: {serverMessage}</div>
                <Button onClick={() => ReloadPage()} type={"submit"} flag_disabled={(title.length==0) || (post.length==0)}>
                    Ок
                </Button>
            </div>}
        </div>
    )
}
