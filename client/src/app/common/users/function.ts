export function calcAge( birth ) {
    let agestring = "";
    if( birth ) {
        var res = new Date(birth);
        const isValidDate = (date: Date) => !Number.isNaN(date.getTime());
        if(isValidDate(res)) {
            var age = -1;
            let today = new Date();
            let thisyear = today.getFullYear();
            let thismonth = today.getMonth();
            
            var year = res.getFullYear();
            var month = res.getMonth();
            
            age =  thisyear - year ;
            if( month >= thismonth ){
                age = age - 1;
            }
            agestring = String(age) + '歳';
        }
        
    }
    return agestring;
}
