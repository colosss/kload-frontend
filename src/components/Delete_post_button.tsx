import { useState } from 'react'
import defualte from "../assets/delete_post_button.svg"
import cancel from "../assets/post_button_cancel.svg"
import "./post_button.css"
import Delete_post_form from './Delete_post_form'
import { Dispatch, SetStateAction } from "react"


type BaseProps = {
    id: number;
};

type WithSetter = BaseProps & {
    setfunc: Dispatch<SetStateAction<boolean>>;
};

type WithoutSetter = BaseProps & {
    setfunc?: undefined;
};
type Post_button_props = WithSetter | WithoutSetter;

export default function Delete_post_button (props:  Post_button_props) {
    const id:number=props.id;
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
            {button_flag && <Delete_post_form id={id}/>}

            <button className={!button_flag?'delete_post_button': 'post_button'} type="button" onClick={()=>Button_click()}>
                <img className={!button_flag?'delete_post_image_button':'post_image_button'} src={!button_flag ? defualte : cancel} alt={!button_flag ? 'post_button' : 'post_button_cancel'}/>
            </button>
        </div>
    );
};