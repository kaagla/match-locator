export const standingsEnabled = (sport, type) => {
    return ['Jalkapallo','Futsal'].includes(sport) && ['level','team'].includes(type) ? true : false
}

export const matchPreviewEnabled = (sport) => {
    return sport === 'Käsipallo' ? false : true
}