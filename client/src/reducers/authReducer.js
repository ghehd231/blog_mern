// import {TEST_DISPATCH} from '../actions/types'//액션 import 

const initialState = {
    isAuthenticated: false,
    user: {}
};

export default function(state = initialState, action){
    switch(action.type){
        // case TEST_DISPATCH:
        //     return {
        //         ...state,//현재 상태는 그대로 두면서
        //         user: action.payload //새로운 값을 만들어서 리턴 시켜줌
        //     }
        default:
            return state;
    }
}