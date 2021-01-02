const displayD = (date) => {
    let day = parseInt(date.split('-')[2])
    return day + '.'
}

export const displayDM = (date) => {
    let month = parseInt(date.split('-')[1])
    let day = parseInt(date.split('-')[2])
    return day + '.' + month + '.'
}

export const displayDMY = (date) => {
    let year = date.split('-')[0]
    let month = parseInt(date.split('-')[1])
    let day = parseInt(date.split('-')[2])
    return day + '.' + month + '.' + year 
}

export const displayDates = (from, to, year=true ) => {
    if (from === to) {
        return year ? displayDMY(from) : displayDM(from)
    } else if (from.split('-')[0] === to.split('-')[0]) {
        if (from.split('-')[1] === to.split('-')[1]) {
            return year ? displayD(from) + ' - ' + displayDMY(to) : displayD(from) + ' - ' + displayDM(to)
        } else {
            return year ? displayDM(from) + ' - ' + displayDMY(to) : displayDM(from) + ' - ' + displayDM(to)
        }
    } else {
        return year ? displayDMY(from) + ' - ' + displayDMY(to) : displayDM(from) + ' - ' + displayDM(to)
    }
}