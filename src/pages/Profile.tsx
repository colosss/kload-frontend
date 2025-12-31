import api, { getUserPosts, getUserName} from '../api';
import './Profile.css'
import Header from "../components/Header";
import Button from "../components/button_handler";
import { Link } from "react-router-dom";
// import type React from "react";

// import { getPosts } from "../api";
import { useState, useEffect } from 'react';
import "./Pages.css"
import "../App.css"
// import type { AxiosError } from 'axios';

export default function Profile (){

    const count_of_simvols=30;
    const count_more_simvols=120;


    const [formFlag, setFormFlag] = useState<boolean>(false)
    
    
    const [username, setUsername] = useState <string>("")
    const [getingname, setGetingname] = useState <string>("")
    const [flag_username_error, setFlag_username_error] = useState<boolean>(false);
    const [touchedUserName, setTouchedUserName] = useState<boolean>(false);

    const [sendStatus, setSendStatus] = useState<'none'|'success'|'error'>('none');
    const [serverMessage, setServerMessage] = useState<string>('');
    const [messages, setMessages] = useState<Array<{title:string, body:string, name_img:string, username:string, id:number}>>([]);
    const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
    function ButtonProfile(){
        setFormFlag(!formFlag)
    }
    const validateUserName = (v: string) => v.trim().length >= 4;

    function handleUserNameChange(v: string) {
        setUsername(v);
        if (touchedUserName) setFlag_username_error(!validateUserName(v));
    }

    function handleUserNameBlur() {
        setTouchedUserName(true);
        setFlag_username_error(!validateUserName(username));
    }
    function handleBlur() {
    if (handleUserNameBlur) handleUserNameBlur();
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        handleUserNameChange(event.target.value)
    }
    const togglePost = (id: number) => {
        setExpandedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    function Reload_Page(){
        window.location.reload();
    }

    const isExpanded = (id: number) => expandedPosts.has(id);
    useEffect(() => {
        let mounted=true;
        (async()=>{
            try{
                const name= await getUserName();
                if(mounted){
                    setGetingname(name);
                    setUsername(name);
                }
            } catch(err){
                console.error("Failed to get username: ", err);
            }
        })();
        return()=>{mounted=false;};
    }, []);
    useEffect(() => {
        if(!getingname)return;
        let mounted = true;
        getUserPosts(getingname)
        
        .then((data) => {
            if (mounted && Array.isArray(data)) {
            setMessages(data);
            }
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
        });
        return () => { mounted = false; };
    }, [getingname]);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
            //Используется на случай если бек принимает данные в формате application/x-www-form-urlencoded
            try {
            await api.put(
            //Изменить путь
            "/user/",
            { username: username},
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
        <div>
            <Header />
            <main>
                <div className = "content_box">
                    {sendStatus!='none' && <div className="info_box">
                        {sendStatus === 'success' && (
                        <div>
                        <h5 className="form_text" >Вы успешно изменили свое имя пользователя на <span style={{color:"green"}}>{username}</span></h5>
                            <Link to ="/">
                            <Button onClick={() => Reload_Page()} type={"button"} flag_disabled={false}>
                            Обновить страницу
                            </Button>
                            </Link>
                        </div>
                        )}
                        {sendStatus === 'error' && (<div>
                        <h5 className="f orm_text" style={{color:"red"}}>{serverMessage}</h5>
                            <Button onClick={() => Reload_Page()} type={"button"} flag_disabled={false}>
                            Заново
                            </Button>
                            </div>
                        )}
                    </div>}
                    <div className="profile_lable_text">Профиль</div>
                    <div className='test_row'>
                        <div className='column_profile_info'>
                            <span className="profile_text"><img src="/default.png" alt="Default_photo" className="image_profile"/></span>
                            <span className="profile_text">Ник: <span style={{color:"red"}}>@{getingname}</span></span>
                            {/* <span className="profile_text">Логин: {!formFlag && "Mifugi1212"}</span> */}
                            {formFlag &&
                                <form onSubmit={handleSubmit} noValidate>
                                    <input type="text"
                                            style={{maxWidth:"100%"}}
                                            onChange={handleChange}
                                            onBlur={handleBlur} 
                                            value={username}
                                            className={flag_username_error==true ? "input_area_incorrect" : "input_area" }/>
                                    <Button 
                                    type="submit"
                                    flag_disabled={username.length<=3 || flag_username_error}
                                    style={{position:"relative", marginRight:"10vw"}}
                                    >Подтвердить</Button>
                                </form>}
                            <Button 
                            type="button"
                            flag_disabled={false}
                            onClick={()=>ButtonProfile()}
                            >{!formFlag ? "Редактировать" : "Отмена"}</Button>

                        </div>
                        <div className='column_space'/>
                        <div className='column_user_posts' >
                            {messages.map((post, index) => {
                                const truncated = post.body.length > count_of_simvols;
                                const shouldShowFull = isExpanded(post.id);
                                const displayText = shouldShowFull || !truncated
                                    ? post.body.slice(0, count_more_simvols-3)
                                    : post.body.slice(0, count_of_simvols - 3) + "..."
                                return(
                                <button key={post.id}
                                        onClick={() => togglePost(post.id)}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer'}}>
                                    <div className="content_text" key={index} >
                                        <div className="lable_text">{post.title}</div>
                                        <span style={{color:"red"}}>  {post.username + "@kload" }</span>
                                        <span>:</span>
                                        <span style={{color: "green"}}>~</span>
                                        <span>$ </span>
                                        {displayText}<Link to={`/post/${post.id}`}>  {"=>"}перейти к посту</Link>
                                    </div>
                                </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}