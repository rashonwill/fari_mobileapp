export const viewsConversion = views => {
    if (views >= 1000){
    return (views / 1000).toFixed(1) + "K";
    } 

    if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
    } 

    if (views >= 1000000000) {
    return (views / 1000000000).toFixed(1) + "B";
    } 

    return views

  }