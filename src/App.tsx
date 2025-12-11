import  { useState, useEffect } from "react";
import "./App.css";
import "./components/button_handler.css";
import Header from "./components/Header";
import { getAccessToken, getPosts, refreshOnce } from "./api";
import Post_button from "./components/Post_button";
// import api from "./api";



export default function App() {
  ////asdasdasdasdasdasd
  const limit=5;
  const [lastid, setLastid] = useState<number>(0);

  const [access, setAccess] = useState<string | null>(() => getAccessToken());

  useEffect(() => {
    let mounted = true;
    

    refreshOnce()
      .then((newAccess: string | null) => {
        if (!mounted) return;
        setAccess(newAccess ?? getAccessToken());
      })
      .catch(() => {
        if (mounted) setAccess(getAccessToken());
      });
    return () => { mounted = false; };
  }, []);

  const [content, setContent] = useState<Array<{title:string, body:string, username:string, id:number}>>([]);

  useEffect(() => {
        getPosts(limit, lastid)
              .then((data) => {
                if (Array.isArray(data)) {
                  setContent(data);
                }
              })
              .catch((error) => {
                console.error("Error fetching posts:", error);
              });
      
      
  }, []); {
            console.error("Refresh failed during response handling:");
        }
  return (
    <div>

      <Header />

      <main className="content_box">
          {content.map((option, index) => (
            <div className="content_text" key={index}>
              <div className="lable_text" >{option.title}</div>
              <span><img className="image" src="../public/default.png" alt={"Profile image default.png"}/></span>
              <span style={{color:"red"}}>  {option.username + "@kload: " }</span>
              {option.body}
              
            </div>
          ))}

          {/* <span>{access}</span> */}
      </main>
      <Post_button/>



    </div>
  );

}