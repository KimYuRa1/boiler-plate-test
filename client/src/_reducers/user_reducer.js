import {
    LOGIN_USER
} from '../_actions/types';

export default function (state={}, action) { //state는 빈 상태
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload } //...(spread operator) : state를 똑같이 가져오는 역할
            //user_action에서 return한 payload를 loginSuccess로 넣어준 것!
            break;
        default:
            return state;
    }
}