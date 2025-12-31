import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

interface Post{
    id:number,
    body:string,
    username:string,
    title:string
}


let accessToken: string | null = null;
export function setAccessToken(token: string | null) { accessToken = token; }
export function getAccessToken() { return accessToken; }

api.interceptors.request.use((config) => {
    if (config.url !== "/user/auth/refresh" && accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;
export async function refreshOnce(){
    console.log("Refreshing token...");
    if(isRefreshing) return refreshPromise;
    isRefreshing = true;
    refreshPromise = api.get("/auth/refresh/" , { withCredentials: true })
    .then(res => {
        console.log("Refresh response:", res.data);
        const newAccess = res.data?.access_token;
        if (newAccess) setAccessToken(newAccess);
        return newAccess;
    })
    .catch(err => {
        console.error("Refresh error:", err.response?.status, err.response?.data);
        throw err;
    })
    .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });
    return refreshPromise;
}

export async function getPosts(limit:number, last_id:number){
    let response: Promise<any> | null = null;
    console.log("Getting posts...");
    response = await api.get("/post/group/",{ params:{limit, last_id}, headers: { "Content-Type": "application/json"}, withCredentials: true })
        .then(res => {
            console.log("Get posts response:", res.data);
            return res.data;
        })
        .catch(err => {
            console.error("Get posts error:", err.response?.status, err.response?.data);
            throw err;
        });
        return response;
    
}

export async function getUserName(): Promise<string> {
    try {
    console.log("Getting user name...");
    const res = await api.get("/user/", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
    console.log("Get user response:", res.data);

    const userData = res.data;
    const username = typeof userData === "string" ? userData : userData.username;
    if (!username) throw new Error("Username not found in /user response");
    return username;
    } catch (err: any) {
    console.error("Get userName error:", err?.response?.status, err?.response?.data || err?.message);
    throw err;
    }
}

export async function getUserPosts(username: string) {
    if (!username) {
        throw new Error("username is required to fetch posts");
    }

    try {
        console.log("Getting user posts for", username);
        const res = await api.get("/post/user/", {
        params: { username }, // -> ?username=Fugi
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        });
        console.log("Get posts response_mes:", res.data);
        return res.data;
    } catch (err: any) {
        console.error("Get posts error:", err?.response?.status, err?.response?.data || err?.message);
        throw err;
    }
}

export async function getPostByID(post_id:number): Promise<Post[]>{
    if(!post_id){
        throw new Error("id"+ post_id+ "is required to fetch posts")
    }
    try{
        console.log("Getting post by id: ", post_id, "...")
        const res = await api.get(`/post/one/${post_id}/`, {
            headers:{"Content-Type": "application/json"},
            withCredentials:true,
        });
        console.log("Get posts by id: ", post_id, " response_mes")
        // return res.data;
        const data= res.data
        if (Array.isArray(data)) {
            return data as Post[];
        } 
        else if (data == null) {
            return [];
        } 
        else {
            return [data as Post];
        }
    }catch(err:any){
        console.error("Get post by id: ",post_id,"error: ", err?.response?.status, err?.response?.data || err?.message)
        throw err;
    }
}


api.interceptors.response.use(
    res=>res,
    async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
        original._retry = true;
        try{
            await refreshOnce();
            return api(original);
        } catch(e){
            setAccessToken(null);
            //Logout or redirect to login page can be handled here
        }
    }
    return Promise.reject(err);
    }
);
export default api;