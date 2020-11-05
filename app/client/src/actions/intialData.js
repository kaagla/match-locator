import axios from 'axios';

export const getInitialData = (name) => async dispatch => {
    const res = await axios.get('api/'+name)
    
    if (name === 'teams') {
        dispatch({
            type: 'ADD_TEAMS',
            data: res.data
        })
    }
    if (name === 'areas') {
        dispatch({
            type: 'ADD_AREAS',
            data: res.data
        })
    }
    if (name === 'levels') {
        dispatch({
            type: 'ADD_LEVELS',
            data: res.data
        })
    }
    if (name === 'info') {
        dispatch({
            type: 'ADD_INFO',
            data: res.data[0]
        })
    }
}