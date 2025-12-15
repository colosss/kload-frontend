import { useState } from 'react'
import defualte from "../assets/post_button.svg"
import red_defualte from "../assets/red_post_button.svg"
import cancel from "../assets/post_button_cancel.svg"
import "./post_button.css"
import Post_form from './post_form'
import { Dispatch, SetStateAction } from "react"


type BaseProps = {
    tema?: string | string[];
    telo?: string | string[];
    put?: boolean;
    id?: number;
};

type WithSetter = BaseProps & {
    setfunc: Dispatch<SetStateAction<boolean>>;
};

type WithoutSetter = BaseProps & {
    setfunc?: undefined;
};

type Post_button_props = WithSetter | WithoutSetter;

export default function Post_button(props: Post_button_props) {
    const { tema, telo, put, id } = props;
    const [button_flag, setButton_flag] = useState(false);

     function Button_click() {
        const newValue = !button_flag;
        setButton_flag(newValue);

        if ("setfunc" in props) {
            props.setfunc(newValue);
        }
    }

    return(
        <div>
            {/* {put&&<Delete_post_button id={id}/>} */}
            
            <button className='post_button' type="button" onClick={()=>Button_click()}>
                <img className='post_image_button' src={!button_flag ? put? red_defualte: defualte : cancel} alt={!button_flag ? 'post_button' : 'post_button_cancel'}/>
            </button>
            {button_flag &&
            <Post_form tema={tema} telo={telo} put={put} id={id}/>}
        </div>
    );
};