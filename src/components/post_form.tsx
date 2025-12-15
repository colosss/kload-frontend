import api from "../api"
import "./post_form.css"
import Button from "./button_handler"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Post_button from "./Post_button"

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


    // const[touchedTitle, setTochedTitle]=useState<boolean>(false);
    // const[touchedPost, setTochedPost]=useState<boolean>(false);

    // const[flagTitleError, setTitleError]=useState<boolean>(false);
    // const[flagPostError, setPostError]=useState<boolean>(false);

    function Button_click(type: string) {
    console.log("Button clicked", type);
    }
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
        const response = await api.put(
        "/post/"+id,
        { title: titleStr, body:bodyStr},
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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

        try {
        const response = await api.post(
        "/post/",
        { title: title, body:post },
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

   useEffect(() => {
    //   setTitle("asdasd")
    if(tema)setTitle(tema)
    if(telo)setPost(telo)
    }, [tema, telo]);
  
// onSubmit={handleSubmit}
    return(

            <div className="post_form_box">
                {sendStatus=='none'&&
                <form  onSubmit={!put?handleSubmit:handleSubmit_put} noValidate>
                    <div className="post_lable_text">{!put?"Форма создания постов":"Форма редактирования постов"}</div>
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
                    <Button onClick={() => Button_click("b")} type={"submit"} flag_disabled={(title.length==0) || (post.length==0)}>
                        Подтвердить
                    </Button>
                </form>
                }
                

                {sendStatus == 'success' && 
                <div>
                     <div className="post_lable_text">{put?"Пост успешно отредактирован":"Пост успешо создан"}</div>
                     {/* <div className="post_text">Server message: {serverMessage}</div> */}
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
                </div>
                }

            </div>

    )
}
