export const setDateFrom = (date) => {
    return {
        type: 'SET_DATE_FROM',
        data: date
    }
}

export const setDateTo = (date) => {
    return {
        type: 'SET_DATE_TO',
        data: date
    }
}