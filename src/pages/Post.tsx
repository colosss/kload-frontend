import "./Pages.css"
import Button from "../components/button_handler";
import Header from "../components/Header";
import "../App.css"
import "./Profile.css";
import { useParams } from "react-router-dom";
import  { useState, useEffect } from "react";
import { getPostByID } from "../api"
import Post_button from "../components/Post_button";
import Delete_post_button from "../components/Delete_post_button";
import api from "../api";


export default function Post(){
    const params = useParams<{ id: string }>(); // uesParams возвращает строки
    const idStr = params.id;
    const id = idStr ? Number(idStr) : 0;
    const [post, setPost] = useState<Array<{title:string, body:string, username:string, id:number}>>([]);
    const [deleteFlag, setDeleteFlag] = useState<boolean>(false)
    const [redactFlag, setRedactFlag] = useState<boolean>(false)

    useEffect(()=>{
        console.log(id)
        if(!id)return;
        // setPost(await getPostByID(id))
        getPostByID(id)
        .then((data) => {
            if(Array.isArray(data)) setPost(data);
            else if (data==null)setPost([]);
            else setPost(data);
            // console.log(data)
            console.log( post.map((option)=>option.body))
        })
        .catch((err) =>{
            console.error(err);
        });
    },[]);{
            console.error("Refresh failed during response handling:");
        }
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

        try {
        const response = await api.put(
        "/post/",
        { title: post, body:post },
        { headers: { "Content-Type": "application/json" } }
        );
        // setSendStatus('success');
    } catch (error: any) {
        // setSendStatus('error');
        const serverMessage = error.response?.data?.details
        ? Array.isArray(error.response.data.details)
            ? error.response.data.details.join('\n')
            : String(error.response.data.details)
        : error.response?.data?.message || error.message || 'Ошибка при отправке';
        // setServerMessage(serverMessage);
        console.error("Ошибка при отправке данных:", error.response?.data || error.message);
    }
  }

    return(
        <div>
            <Header />
            <main>
                <div className = "content_box">

                    <div className="profile_lable_text">Форма редактирования и удаления постов</div>
                    {post.map((option, index) => (
                        <div className="content_text" key={index}style={{whiteSpace: "pre-wrap"}}>
                            <div className="lable_text" >{option.title}</div>
                            <span><img className="image" src="../../public/default.png" alt={"Profile image default.png"}/></span>
                            <span style={{color:"red"}}>  {option.username + "@kload: " }</span>
                            {option.body}</div>
                    ))}
                    
                    <div className="post_buttons_row">
                    </div>
                </div>
            </main>
            {!deleteFlag&&<Post_button telo={post.map((option)=>option.body)} tema={post.map((option)=>option.title)} put={true} id={id} setfunc={setRedactFlag}/>}
            {!redactFlag&&<Delete_post_button id={id} setfunc={setDeleteFlag}/>}
        </div>
    );
}