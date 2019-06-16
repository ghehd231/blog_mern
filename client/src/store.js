/*
 * Store.js는 로그인 정보, 프로필 등을 캐시에 담아주는 역할 
 * 
 * Store 에는 reducer 와 현재 앱상테가 들어있음
 * Reducer 는 변화를 일으키는 함수
 * Reducer 는 두가지 파라미터를 받아옴 
 * function reduer(state - 현재 상태 , action - 이것을 참조하여 새로운 상태를 만들어서 반환 ){
 * // 상태 업데이트 로직
 * return alteredState;
 * }
 */

import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;