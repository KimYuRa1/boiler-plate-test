import axios from 'axios';
import {
    LOGIN_USER ,
    REGISTER_USER,
    AUTH_USER
}from './types'

export function loginUser(dataToSubmit) { //loginPage에서 준 정보를 파라미터를 통해 받음.
    const request = axios.post('/api/users/login', dataToSubmit) //server> index.js의 /api/users/login으로 이동
            .then( response => response.data ) // server에서 받은 data를 request에다가 저장함.

    return {//reducer로 보내야함. reducer에서 이전의 state와 현재의action을 조합해서 다음 state를 만들어줘야하기 때문

        type: "LOGIN_USER",
        payload: request
    }
}

export function registerUser(dataToSubmit) { 
    const request = axios.post('/api/users/register', dataToSubmit) //server> index.js의 /api/users/register으로 이동
            .then( response => response.data ) // server에서 받은 data를 request에다가 저장함.

    return {//reducer로 보내야함. reducer에서 이전의 state와 현재의action을 조합해서 다음 state를 만들어줘야하기 때문

        type: "REGISTER_USER",
        payload: request
    }
}

export function auth(dataToSubmit) { 
    const request = axios.get('/api/users/auth') //server> index.js의 /api/users/auth으로 이동, get메소드니까 body부분(dataToSubmit)은 필요 없음.
            .then( response => response.data ) // server에서 받은 data를 request에다가 저장함.

    return {//reducer로 보내야함. reducer에서 이전의 state와 현재의action을 조합해서 다음 state를 만들어줘야하기 때문

        type: "AUTH_USER",
        payload: request
    }
}