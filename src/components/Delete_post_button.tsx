import { useState } from 'react'
import defualte from "../assets/delete_post_button.svg"
import cancel from "../assets/post_button_cancel.svg"
import "./post_button.css"
import Delete_post_form from './Delete_post_form'

type Post_button_props = {
    id?:number
}

export default function Delete_post_button ({id}:Post_button_props){
    const [button_flag, setButton_flag] = useState <boolean>(false);

    function Button_click(){
        if(!button_flag)setButton_flag(true);
        else setButton_flag(false)
    }

    return(
        <div>
            <button className='delete_post_button' type="button" onClick={()=>Button_click()}>
                <img className='delete_post_image_button' src={!button_flag ? defualte : cancel} alt={!button_flag ? 'post_button' : 'post_button_cancel'}/>
            </button>
            {button_flag&& <Delete_post_form id={id}/>}
        </div>
    );
};