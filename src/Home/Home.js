import {useEffect, useState,useCallback} from "react";
import Papa from "papaparse";
import {AllCountrys} from "./AllCountrys";
import {CountrInfo} from "./CountrInfo";
import logo from '../Assets/logo.svg'
import ex from '../Assets/CloseIcon.svg'


export const Home = () => {
    const [countrylist, setCountrylist] = useState([]);
    const [letters, setLetters] = useState('');
    const [parent, setParent] = useState([]);
    const [countryinfoshow,setCountryinfoshow]=useState(false);
    useEffect(async () => {
        const response = await fetch('/api/countries/?fields=id,capital_id,name,capital_name&format=csv&no_paginate=true&order_by=-capital_name', {
            "headers": {

                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .catch(function (error) {
                console.log(error);
            });
        ;
        var fileInputName = (await response.text());
        var papapa = Papa.parse(fileInputName);
        var countrytojson = [];
        papapa.data.map((i) => {
            countrytojson.push({
                "country_name": i[2],
                "country_id": i[0],
                "capital_id": i[1],
                "capital_name": i[3]
            })
        });
        setCountrylist(countrytojson);

    }, []);

    useEffect(async ()=>{

        if(parent.country_name!=undefined){
            setLetters(parent.country_name);
        }

    },[parent]);
    const updateValue = (e) => {
        setLetters(e.target.value);
        if(e.target.value!=parent.country_name){
            setCountryinfoshow(false);
        }

    }
    const lockCountry = async (country) => {
        setCountryinfoshow(true);
        if (country == undefined) {
            country = '';
        }
        setLetters(parent.country_name);
        setLetters(country);
    }
    const removeStates = () => {
        setLetters('');
        setCountryinfoshow(false);
    }
    return (
        <div className="auto-n-count">
            <div className="auto-complete">
                <div className="logo-welcome-home"><img src={logo} /></div>
                <div className="input-and-close">
                     <input className="autoc-input" onChange={updateValue} value={ letters}></input>
                    <div className="ex" onClick={() => removeStates()}><img src={ex} /></div>
                </div>
            </div>
            <div className="country-under">{countrylist.length > 0 &&  !countryinfoshow?
                (<div className="country-list" onClick={() => lockCountry(parent.country_name)}>{<AllCountrys
                    data={{countrylist, letters}} setParent={setParent}/>}</div>) :
                null}
            </div>
            <div onClick={() => lockCountry(parent.country_name)}>{parent != '' && countryinfoshow?
                (<div className="country-info"><CountrInfo data={{parent}}/></div>) :
                <div>{null}</div>
            }</div>
        </div>
    )
}
