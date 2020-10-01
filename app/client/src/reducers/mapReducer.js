const initialState = {'city': 'Suomi', 'lat': 63, 'lon': 25}

export const mapCenterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MAP_CENTER':
            return action.data
        default:
            return state
    }
}