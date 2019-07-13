import axios from 'axios'


import {
    GET_PROFILE,
    PROFILE_LOADING,
    GET_ERRORS,
    CLEAR_CURRNT_PROFILE

} from './types';

//Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());//비동기
    axios
        .get('api/profile')
        .then(res=>{
            dispatch({
                type: GET_PROFILE,
                payload: res.data //데이터를 담아둠
            })
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: {} // 데이터를 담는 그릇
            })
        })
}

// 액션 생성함수 (Action Creator)
// 액션 생성함수는, 액션을 만드는 함수입니다. 단순히 파라미터를 받아와서 액션 객체 형태로 만들어주죠.
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    };
};

//clear profile
export const clearCurrentProfile = () => {
    return{
        type: CLEAR_CURRNT_PROFILE
    };
};