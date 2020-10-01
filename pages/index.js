import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import {useId} from 'react-id-generator';

import Link from 'next/link'
import { useRouter } from 'next/router'

function index(props) {
    const [state, updateState] = useState([]);
    const router = useRouter();

    const CardsSpace = state.map(elem => {
        return (
            <div key={elem.flight_number} className="card-custom">
                <div className="img-cont" alt="mission_image">
                    <img src={elem.links.mission_patch_small} className="img" width="200" height="170"></img>
                </div>

                <div className="mission-name">{elem.mission_name} # {elem.flight_number}</div>
                <div className="mission-ids">Mission Ids:
                        <ul>
                        {elem.mission_id.map((missionIdList,idx) => {
                            return (
                                <li className="mission-id-list" key={elem.flight_number+'missionids'+idx}>{missionIdList}</li>
                            )
                        })}
                    </ul>
                </div>
                <div className="launch-year">Launch Year:{elem.launch_year}</div>
                <div className="successful-launch">Successful Launch: {elem.launch_success ? elem.launch_success.toString() : ''}</div>
                <div className="successful-landing">Successful Landing: {elem.rocket.first_stage.cores[0].land_success}</div>


            </div>)

    })


    const launchHander = (e) => {
        let val = e.target.innerHTML;
        let clasNam = e.target.className;
        let url = "";
        let cacheName= ""
        switch (clasNam) {
            case "filterBtns":
                url = `https://api.spaceXdata.com/v3/launches?limit=100&launch_year=${val}`;
                
                router.push(`/?launchYear=${val}`, undefined, { shallow: true });
                
                break;
            case "filterBtns-successLaunch":
                url = `https://api.spacexdata.com/v3/launches?limit=100&launch_success=${val.lowerCase}`;
                router.push(`/?successLaunch=${val}`, undefined, { shallow: true })
                
            
                break;
            case "filterBtns-successLand":
                url = `https://api.spaceXdata.com/v3/launches?limit=100&launch_success=true&land_success=${val.lowerCase}`;
                router.push(`/?successLand=${val}`, undefined, { shallow: true })
                
                break;
            default:
                break;
            
        }

       
        if(localStorage.getItem(url) != undefined){
            console.log(localStorage.getItem(url));
            updateState(JSON.parse(localStorage.getItem(url)));
            console.log("already cached")
        }else{
            axios.get(url)
            .then(res => {
                updateState(res.data);
                localStorage.setItem(url,JSON.stringify(res.data));
                console.log("not cached putting data into cache...")
            }).catch(err => {
                console.log(err);
            })
        }
        
                    
    }

    useEffect(() => {
        axios.get('https://api.spaceXdata.com/v3/launches?limit=100')
            .then(res => {
                updateState(res.data)
            }).catch(err => {
                console.log(err)
            })

        let filterBtns = document.getElementsByClassName("filterBtns");
        for (let i = 0; i < filterBtns.length; i++) {
            filterBtns[i].addEventListener("click", launchHander);
        }

        let filterBtnsLaunch = document.getElementsByClassName("filterBtns-successLaunch");
        for (let i = 0; i < filterBtnsLaunch.length; i++) {
            filterBtnsLaunch[i].addEventListener("click", launchHander);
        }

        let filterBtnsLand = document.getElementsByClassName("filterBtns-successLand");
        for (let i = 0; i < filterBtnsLand.length; i++) {
            filterBtnsLand[i].addEventListener("click", launchHander);
        }

    }, [])


    return (

        <div>

            <Container fluid>
                <Row>
                    <Col>
                        <h1>SpaceX Launch programs</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={3} lg={2} sm={12} xs={12}>
                        <div className="filter-cont">
                            <b>Filters</b>
                            <div className="filter-wrap">
                                <p className="filter-head">Launch Year</p>
                                <div className="filter-divs">
                                    <div>
                                        <span className="filterBtns">2006</span>
                                        <span className="filterBtns">2007</span>
                                    </div>
                                    <div>
                                        <span className="filterBtns">2008</span>
                                        <span className="filterBtns">2009</span>
                                    </div>
                                    <div>
                                        <span className="filterBtns">2010</span>
                                        <span className="filterBtns">2011</span>
                                    </div>
                                    <div>
                                        <span className="filterBtns">2012</span>
                                        <span className="filterBtns">2013</span>
                                    </div>
                                    <div>
                                        <span className="filterBtns">2014</span>
                                        <span className="filterBtns">2015</span>
                                    </div>
                                    <div>
                                        <span className="filterBtns">2016</span>
                                        <span className="filterBtns">2017</span>
                                    </div>
                                    <div>
                                        <span className="filterBtns">2018</span>
                                        <span className="filterBtns">2019</span>
                                    </div>
                                    <div>
                                        <span className="filterBtns">2020</span>
                                    </div>
                                </div>

                                <p className="filter-head">Successful Launch</p>
                                <div className="filter-launch-cont">
                                    <div>
                                        <span className="filterBtns-successLaunch">True</span>
                                        <span className="filterBtns-successLaunch">False</span>
                                    </div>
                                </div>

                                <p className="filter-head">Successful Landing</p>
                                <div className="filter-launch-cont">
                                    <div>
                                        <span className="filterBtns-successLand">True</span>
                                        <span className="filterBtns-successLand">False</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs= {12} sm={12} md={9} lg={10}>
                        <div className="cards-cont">
                            {state.length > 0 ? CardsSpace : ''}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 style={{ textAlign: 'center' }}><b>Developed By:</b>Puja</h3>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default index;
