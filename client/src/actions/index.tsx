import { Dispatch } from 'redux';
import axios from 'axios';
// 액션 타입을 선언
// 뒤에 as const 를 붙여줌으로써 나중에 액션 객체를 만들게 action.type 의 값을 추론하는 과정에서
// action.type 이 string 으로 추론되지 않고 'counter/INCREASE' 와 같이 실제 문자열 값으로 추론 되도록 해줍니다.
const SEARCH_DREAM = 'SEARCH_DREAM' as const;
const SEARCH_DREAM_SUCCESS = 'SEARCH_DREAM_SUCCESS' as const;
const SEARCH_DREAM_ERROR = 'SEARCH_DREAM_ERROR' as const;

const USER_INFO = 'USER_INFO' as const;
const USER_EDIT_INFO = "USER_EDIT_INFO" as const;
const WITHDRAW = "WITHDRAW" as const;
const GET_GOOGLE_TOKEN = "GET_GOOGLE_TOKEN" as const;

// 액션 생성함수 선언

export const SearchDreamAct = (data: string) =>  { 
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: SEARCH_DREAM,
        });
        try {
            const response = await axios
                .get(process.env.REACT_APP_URL + `/search/search`,{
                    params:{
                    query: data + ' 꿈풀이',
                    },
                })
                if(response.data.items){
                    dispatch({ 
                        type: SEARCH_DREAM_SUCCESS,
                        payload: response.data.items
                    })
                  }    

        } catch (err) {
            if (axios.isAxiosError(err)) {
                dispatch({
                    type: SEARCH_DREAM_ERROR,
                    payload: err.message,
                })
            } else {
                console.log('errr');
                console.dir(err);
            }

        }
    }
}

export const SignInAct = (data: UserInfo) => {
    return {
        type: USER_INFO,
        payload: data
    }
}
interface Data { // 나중에 필요할지도! 일단 kipppp
    bloggerlink: string;
    bloggername: string;
    description: string;
    link: string;
    postdate: string;
    title: string;
}

interface UserInfo { // 나중에 필요할지도! 일단 kipppp
    accessToken: string;
    email: string;
    username: string;
    profile: string;
}

// 모든 액션 겍체들에 대한 타입을 준비해줍니다.
// ReturnType<typeof _____> 는 특정 함수의 반환값을 추론해줍니다
// 상단부에서 액션타입을 선언 할 떄 as const 를 하지 않으면 이 부분이 제대로 작동하지 않습니다.

interface SearchDrm_Action {
    type: typeof SEARCH_DREAM,
}
interface SearchDrmSuccess_Action {
    type: typeof SEARCH_DREAM_SUCCESS,
    payload: Data[],
}
interface SearchDrmErr_Action {
    type: typeof SEARCH_DREAM_ERROR,
    payload: string,
}

type Action = 
    | SearchDrm_Action
    | SearchDrmSuccess_Action
    | SearchDrmErr_Action
    | ReturnType<typeof SignInAct>

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다

type ActionState = {
    search: {
        loading: boolean,
        data: Data[],
        error: string | null,
    },
    user: {
        accessToken: string;
        email: string;
        username: string;
        profile: string;
    }
}

// 초기상태를 선언합니다.
const initialState: ActionState = {
    search: {
        loading: false,
        data: [],
        error: null,
    },
    user: {
        accessToken: '',
        email: '',
        username: '',
        profile: ''
    }
};

// 리듀서를 작성합니다.
// 리듀서에서는 state 와 함수의 반환값이 일치하도록 작성하세요.
// 액션에서는 우리가 방금 만든 CounterAction 을 타입으로 설정합니다.
export function searchReducer (state: ActionState = initialState, action: Action): ActionState {
    switch (action.type) {
        case SEARCH_DREAM:
            return Object.assign({}, state, {
                search: { loading: true, data: [], error: null }
            })
        case SEARCH_DREAM_SUCCESS:
            return Object.assign({}, state, {
                search: { loading: false, data: action.payload, error: null }
            })
        case SEARCH_DREAM_ERROR:
            return Object.assign({}, state, {
                search: { loading: false, data: [], error: action.payload }
            })         
        default:
            return state;
    }
}
export function usersReducer (state: ActionState = initialState, action: Action): ActionState {
    switch (action.type) {
        case USER_INFO:
            return Object.assign({}, state, {
                user: action.payload
            })
        default:
            return state;
    }
}