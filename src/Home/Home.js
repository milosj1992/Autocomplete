import {useEffect, useState} from "react";
import Papa from "papaparse";
import {AllCountrys} from "./AllCountrys";
import {CountrInfo} from "./CountrInfo";
import logo from '../Assets/logo.svg'
import ex from '../Assets/CloseIcon.svg'


export const Home = (token) => {
    const [countrylist, setCountrylist] = useState([]);
    const [letters, setLetters] = useState('');
    const [parent, setParent] = useState([]);
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
    }, [letters]);

    const updateValue = (e) => {
        setLetters(e.target.value);
    }
    const lockCountry = (country) => {
        if (country == undefined) {
            country = '';
        }
        setLetters(parent.country_name);
        setLetters(country);
    }
    const removeStates = () => {
        setCountrylist([]);
        setLetters('');
        setParent([]);
    }
    return (
        <div className="auto-n-count">
            <div className="auto-complete">
                <div className="logo-welcome-home"><img src={logo} /></div>
                <div className="input-and-close">
                     <input className="autoc-input" onChange={updateValue} value={parent.country_name || letters}></input>

                    <div className="ex" onClick={() => removeStates()}><img src={ex} /></div>
                </div>
            </div>
            <div className="country-under">{countrylist.length > 0 && parent.country_name == undefined ?
                (<div className="country-list" onClick={() => lockCountry(parent.country_name)}>{<AllCountrys
                    data={{countrylist, letters}} setParent={setParent}/>}</div>) :
                null}
            </div>
            <div onClick={() => lockCountry(parent.country_name)}>{parent != '' ?
                (<div className="country-info"><CountrInfo data={{parent, token}}/></div>) :
                <div>{null}</div>
            }</div>
        </div>
    )
}