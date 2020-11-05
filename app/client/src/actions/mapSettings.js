import axios from 'axios';

export const setMapCenter = (item) => async dispatch => {

    if (item.name === 'Suomi') {
        dispatch({
            type: 'SET_MAP_CENTER',
            data: {'city': 'Suomi', 'lat': 63, 'lon': 25}
        })
    } else {        
        const type_name = item['type']

        const area = {}
        area[type_name] = {...item}

        const res = await axios.post('/api/areacoordinates', area)
        
        dispatch({
            type: 'SET_MAP_CENTER',
            data: res.data[0]
        })
    }
}