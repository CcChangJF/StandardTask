/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
    
    };


    render() {
        return (
            <div className="ui sixteen wide column">
                <label>This is self-introduction.</label>
            </div>
        );
       
    }
}



