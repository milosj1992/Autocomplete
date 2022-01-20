import {useEffect} from "react";

export const AllCountrys = ({data,setParent}) => {
    useEffect(async () => {
    }, [data]);
    if (data.countrylist.length > 1 && data.letters != '') {
        return data.countrylist.map((i,item) => {

                if (i.country_name != undefined && (i.country_name).startsWith(data.letters)) {
                    var country_id=i.country_id;
                    var country_name=i.country_name;
                    return <div key={item} onClick={()=>setParent({country_id,country_name})}>{i.country_name}</div>
                }
            }
        )
    } else {
        return (
            <div>{null}</div>
        )
    }
}



