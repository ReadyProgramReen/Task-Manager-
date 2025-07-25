import {createContext, useContext, useState, ReactNode} from "react";

// define User type when logged in 
interface User {
    id: number,
    email: string,
}

//define the context shape
interface AuthContextType {
    user: User | null,
    token: string | null,
    login : (user: User, token : string)=> void ; // a function that takes in user and token and return nothing
    logout : ()=>void;

}

//create the context object with type definition or undefined 
const AuthContext  = createContext<AuthContextType | undefined>(undefined)

//wrapper component 
export const AuthProvider = ({children}: {children: ReactNode})=>{

    //keeping track of the current user and token
    const [user,setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string|null>(null);

    //define the login function
    const login = (newUser:User, newToken:string)=>{
        //store the user info and token in the corresponding setstate 
        setUser(newUser);
        setToken(newToken);

        //set token in localStorage
        localStorage.setItem("token", newToken);
    };

    //define the logout function 
    const logout = ()=>{
        //set states back to null
        setUser(null);
        setToken(null);

        //remove token from local storage 
        localStorage.removeItem("token");
    };

    //provide the context; gives values to all component inside <AuthProvider> (Now you can call useAuth() to get access)
    return (
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
}

//create custom hook; instead of importing useContent(authContext everywhere); just call useAuth
export const useAuth = ()=>{
    const context = useContext(AuthContext)
}