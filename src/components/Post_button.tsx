import { useState } from 'react'
import defualte from "../assets/post_button.svg"
import red_defualte from "../assets/red_post_button.svg"
import cancel from "../assets/post_button_cancel.svg"
import "./post_button.css"
import Post_form from './post_form'
import Delete_post_button from './Delete_post_button'

type Post_button_props = {
    tema?:string | string[],
    telo?:string | string[],
    put?:boolean, 
    id?:number
}

export default function Post_button ({tema, telo, put, id}:Post_button_props){
    const [button_flag, setButton_flag] = useState <boolean>(false);

    function Button_click(){
        if(!button_flag)setButton_flag(true);
        else setButton_flag(false)
    }

    return(
        <div>
            {!button_flag&&<Delete_post_button id={id}/>}
            
            <button className='post_button' type="button" onClick={()=>Button_click()}>
                <img className='post_image_button' src={!button_flag ? put? red_defualte: defualte : cancel} alt={!button_flag ? 'post_button' : 'post_button_cancel'}/>
            </button>
            {button_flag &&
            <Post_form tema={tema} telo={telo} put={put} id={id}/>}
        </div>
    );
};