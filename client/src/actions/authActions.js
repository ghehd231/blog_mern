//import {TEST_DISPATCH} from './types';
import axios from 'axios';
import {GET_ERRORS} from './types';

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