import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';
import Axios from 'axios';

export function loginUser(dataTosubmit){
   const request = axios.post('/api/users/login', dataTosubmit)
        .then(response => response.data)
    
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataTosubmit){
    const request = axios.post('/api/users/register', dataTosubmit)
         .then(response => response.data)
     
     return {
         type: REGISTER_USER,
         payload: request
     }
 }

 export function auth(){
    const request = axios.get('/api/users/auth')
         .then(response => response.data)
     
     return {
         type: AUTH_USER,
         payload: request
     }
 }
 Axios.get('/api/users/auth')