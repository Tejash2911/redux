import { createStore, applyMiddleware, combineReducers } from "redux"
import logger from "redux-logger"
import thunk from "redux-thunk"
import axios from "axios"

const history = []

// constants of action names
const INC = "account/increment"
const DEC = "account/decrement"
const IBA = "account/incrementByAmount"
const INCBONUS = "bonus/increment"
const getAccUserPending = "account/getUser/pending"
const getAccUserFulFilled = "account/getUser/fulfilled"
const getAccUserRejected = "account/getUser/rejected"

// store
const store = createStore(combineReducers({
    account: accountReducer,
    bonus: bonusReducer
}), applyMiddleware(logger.default, thunk.default));

// reducer
function accountReducer(state = { amount: 1 }, action) {
    switch (action.type) {
        case getAccUserFulFilled:
            return { amount: action.payload, pending: false }
        case getAccUserRejected:
            return { ...state, error: action.error, pending: false }
        case getAccUserPending:
            return { ...state, pending: true }
        case INC:
            return { amount: state.amount + 1 }
        case DEC:
            return { amount: state.amount - 1 }
        case IBA:
            return { amount: state.amount + action.payload }
        default:
            return state
    }
}

function bonusReducer(state = { points: 0 }, action) {
    switch (action.type) {
        case INCBONUS:
            return { points: state.points + 1 }
        case IBA:
            if (action.payload >= 100) {
                return { points: state.points + 1 }
            }
        default:
            return state
    }
}

// global state
// store.subscribe(() => {
//     history.push(store.getState())
//     console.log(history)
// })

// action creators
function getUserAccount(id) {
    return async (dispatch, getState) => {
        try {
            dispatch(getAccountUserPending())
            const { data } = await axios.get(`http://localhost:3000/accounts/${id}`);
            dispatch(getAccountUserFulFilled(data.amount))
        } catch (error) {
            dispatch(getAccountUserRejected(error.message))
        }
    }
}

function getAccountUserFulFilled(value) {
    return { type: getAccUserFulFilled, payload: value }
}

function getAccountUserRejected(error) {
    return { type: getAccUserRejected, error: error }
}

function getAccountUserPending() {
    return { type: getAccUserPending }
}

function increment() {
    return { type: INC }
}

function decrement() {
    return { type: DEC }
}

function incrementByAmount(value) {
    return { type: IBA, payload: value }
}

function incrementBonus() {
    return { type: INCBONUS }
}

// action
setTimeout(() => {
    store.dispatch(getUserAccount(1))
}, 2000)

