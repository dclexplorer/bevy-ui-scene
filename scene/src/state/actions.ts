export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

export type IncrementAction = {
    type: typeof INCREMENT;
}

export type DecrementAction = {
    type: typeof DECREMENT;
}

export type Actions = IncrementAction | DecrementAction;

export const increment = (): IncrementAction => ({ type: INCREMENT });
export const decrement = (): DecrementAction => ({ type: DECREMENT });

export const SET_MESSAGE = 'SET_MESSAGE';

export type SetMessageAction = {
    type: typeof SET_MESSAGE;
    payload: string;
}

export type AppActions = SetMessageAction;

export const setMessage = (message: string): SetMessageAction => ({
    type: SET_MESSAGE,
    payload: message,
});