import { combineReducers } from "redux";
import user from './user_reducer';

const rootReducer = combineReducers({ //combineReducer을 이용하여 rootReducer에서 하나로 합쳐주는 것임!
    user
})

export default rootReducer;