export const viewsConversion = views => {
    if (views >= 1_000){
    return (views / 1_000).toFixed(1) + "K";
    } 

    if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1) + "M";
    } 

    if (views >= 1_000_000_000) {
    return (views / 1_000_000_000).toFixed(1) + "B";
    } 

    return views

  }