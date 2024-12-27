import { type AppState, type Action } from './types';
import { DECREMENT, INCREMENT, SET_MESSAGE } from './actions';


export function reducer(state: AppState = initialState, action: Action): AppState {
    switch (action.type) {
        case INCREMENT:
            return { ...state, counter: state.counter + 1 };
        case DECREMENT:
            return { ...state, counter: state.counter - 1 };
        case SET_MESSAGE:
                return { ...state, message: action.payload };
        default:
            return state;
    }
}

const initialState: AppState = {
    message: 'Hello, World!',
    counter: 0
};
