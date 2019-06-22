//import {TEST_DISPATCH} from './types';
import axios from 'axios';
//import {GET_ERRORS} from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';


/*Register User (액션 생섬함수)
export const registerUser = userData => {

    //액션 객체를 만들어서 내보냄
    return {
        type: TEST_DISPATCH,//액션 타입 지정
        payload : userData //넘겨 받은값을 payload로 저장 
    };
}
*/

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/user/register', userData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

//login - get user token 
export const LoginUser = userData => dispatch => {
    axios  
        .post('/api/users/login', userData)
        .then(res => {
            //save to localstorage
            const {token} = res.data;

            //set token to ls
            localStorage.setItem('jwtToken', token);

            //set token to auth header
            setAuthToken(token);

            //Decode token to get user data
            const decoded = jwt_decode(token);

            //Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })

};

//set logged in user (현재 유저에 대한 정보 )
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};
