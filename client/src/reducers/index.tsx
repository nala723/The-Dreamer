import { combineReducers } from "redux";
import {searchReducer, usersReducer } from "../actions";
import { persistReducer } from "redux-persist"; 
import storage from "redux-persist/lib/storage"; // local storage에 저장

const persistConfig = {
    key: 'root', // localStorage에 저장
    storage, 
    whitelist: ['usersReducer'], //  reducer 중에 use reducer만 localstorage에 저장합니다.
	// blacklist -> 그것만 제외합니다
}

const rootReducer = combineReducers({
    searchReducer,
    usersReducer,
});

export default persistReducer(persistConfig, rootReducer);
// export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.