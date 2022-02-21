import { combineReducers } from 'redux'
import { searchReducer, usersReducer } from '../actions'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['usersReducer'],
}

const rootReducer = combineReducers({
  searchReducer,
  usersReducer,
})

export default persistReducer(persistConfig, rootReducer)

export type RootState = ReturnType<typeof rootReducer>
