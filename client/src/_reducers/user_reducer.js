/*
Reducer : action을 함으로 인해서 원래 3이었던 state가 action을 통함으로 인해 4로 변했다. 는 것을 설명해주는 것
(previousState, action) => nextState : 이전 State와 action object를 받은 후에 next state(변해진 state)를 return하는 것이 Reducer이다!
*/

import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';


export default function (state={}, action) { //state는 빈 상태
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload } //...(spread operator) : state를 똑같이 가져오는 역할/ ...state : 원본 state(아무것도 없는 것) 가져옴
            //user_action에서 return한 payload를 loginSuccess로 넣어준 것!
            break;
        case REGISTER_USER:
                return {...state, register: action.payload } //register: action.payload => 서버에서 가져온 response를 action.payload를 register에 넣어줌
                break;
        case AUTH_USER:
                return {...state, userData: action.payload } //userData: action.payload => 서버에서 가져온 response(index.js의 '/api/users/auth'부분에서 받아온 모든 user data)를 action.payload를 userData에 넣어줌
                break;
        default:
            return state;
    }
}