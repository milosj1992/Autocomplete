import {useEffect, useState} from "react";
var haversineformula=(maparray)=>{
    var returnmax=0;
    var returnmin=Number.MAX_SAFE_INTEGER;
    var returncitymax=[];
    var returncitymin=[];
    var newmaparray=[];
    maparray.map((i)=>{
        i.cities.map((j)=>{
            newmaparray.push(j);
        })

    });
     maparray=newmaparray;
    for(var i=0;i<maparray.length;i++)
    {
        for(var j=0;j<maparray.length;j++){
            Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            }
            if(i==j){
                continue;
            }
           var lat1=maparray[i].lat;
            var  lat2=maparray[j].lat;
           var lon1=maparray[i].lon;
            var lon2=maparray[j].lon;

            var R = 6371; // km
            var x1 = lat2-lat1;
            var dLat = x1.toRad();
            var x2 = lon2-lon1;
            var dLon = x2.toRad();
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            if(d>returnmax){
                returnmax=d;
                returncitymax[0]=maparray[i];
                returncitymax[1]=maparray[j];
            }
            if(d<returnmin){
                returnmin=d;
                returncitymin[0]=maparray[i];
                returncitymin[1]=maparray[j];
            }
        }
    }
    const farandnead={
        far:{
            city:returncitymax,
            value:returnmax
        },
        near:{
            city:returncitymin,
            value:returnmin
        }
    };
    return farandnead;
}

export const CountrInfo = ({data}) => {
    const[responsecity,setResponsecity]=useState([]);
    const[citylist,setCitylist]=useState([]);
    const[urlforcityfetch,setUrlforcityfetch]=useState(`/api/countries/${data.parent.country_id}/cities?fields=id,name,lat,lon,population,capital`);
    useEffect(async () => {
        const response=await fetch(urlforcityfetch,{
            "headers":{

                'Authorization':'Bearer '+data.token.token
            }
        });
        var citi=await response.json();
        if(citi!=undefined && citi.summary!=null ){
            if(citi.summary.next!=null){
                setUrlforcityfetch('/api/countries/'+decodeURIComponent(citi.summary.next));
            }

            setCitylist(citylist=>[...citylist,citi]);
        }
    }, [urlforcityfetch]);
    if(data!=undefined && data.parent!=undefined && citylist!=undefined && citylist.length>0 && citylist[0]!=undefined && citylist[0].summary.total_pages ){
        if(citylist[(citylist[0].summary.total_pages)-1] && responsecity.length==0){
            setResponsecity(haversineformula(citylist))
        }
        else{
        }

        return(<div>
        {responsecity!=undefined && responsecity.near!=undefined && responsecity.far.city.length>0 ?
            <div>
                <div className="closest">Closest city in {data.parent.country_name}</div>
                <div className="closest-city">{responsecity.near.city[0].name} - {responsecity.near.city[1].name}</div>
                <div className="closest-distance">distance {Math.round(responsecity.near.value * 100) / 100 }km</div>
                <div className="farest">Farest city in {data.parent.country_name}</div>
                <div className="farect-city">{responsecity.far.city[0].name} - {responsecity.far.city[1].name}</div>
                <div className="farest-distance">distance {Math.round(responsecity.far.value * 100) / 100 }km</div>
            </div>:
            <div>calculating</div>}
            </div>
        )
    }
    else{
        return(
            <div>{null}</div>
        )
    }
}