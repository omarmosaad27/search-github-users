import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({children}) =>{
    const [ githubUser, setGithubUser ] = useState(mockUser);
    const [ repos, setRepos ] = useState(mockRepos);
    const [ followers, setFollowers ] = useState(mockFollowers);
    // request loading
    const [requests ,setRequests] = useState(0)
    const [isLoading ,setIsLoading] = useState(false)
    const [errors, setErrors] = useState({show:false, msg:""})
    // check rate limits
    const checkRequests = ()=>{
        axios(`${rootUrl}/rate_limit`).then(({data})=>{
            let {rate:{remaining}} = data
            
            setRequests(remaining)
            if(remaining === 0){
                ///throw Error
                toggleError(true, "sorry, you have exceeded your hourly limit!")
            }
        }).catch((err)=> console.log(err))
    }
    // error
    const toggleError = (show = false , msg = "") =>{
        setErrors({show,msg})
    }
    // serach github user 
    const SearchGithubUser = async (user) =>{
        // toggle error 
        setIsLoading(true)
        // fetch request using axios 
        const response = await axios(`${rootUrl}/users/${user}`).catch(err => console.log(err))
        console.log(response);
        // check if reponse exist set github user to this data fetched
        if(response){
            setGithubUser(response.data)
            const {login, followers_url} = response.data;
            // when we fetch repos and followers like this it will display repos then request followers and then display it in order to display all at the same time we will use promise.allSettled() to request all at the same time
            // // fetch repos 
            // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then(response =>setRepos(response.data) )
            
            // // fetch folloers 
            // axios(`${followers_url}?per_page=100`).then(response => setFollowers(response.data))
            await Promise.allSettled([
                axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`)
            ]).then((results)=>{
                const [repos, followers] = results;
                const status = "fulfilled"
                if(repos.status === status){
                    setRepos(repos.value.data)
                }
                if(followers.status === status){
                    setFollowers(followers.value.data)
                }
            }).catch((err)=>console.log(err))
            
        }else{
            // if no response show the error
            toggleError(true, 'there is no user with that user name')
        }
        checkRequests()
        setIsLoading(false)
    }
    useEffect( checkRequests ,[])
    return (
        <GithubContext.Provider 
        value={{
            githubUser,
            repos,
            followers,
            requests,
            errors,
            SearchGithubUser,
            isLoading
        }}
        >
            {children}
        </GithubContext.Provider>
    )
}

export { GithubProvider, GithubContext }