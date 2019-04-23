import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader, Image, Button, Icon } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import { profileUrl } from '../Config.js';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyContact: null,
            skills: [],
            talents: [],
        }

        this.init = this.init.bind(this);
        this.loadEmployerProfile = this.loadEmployerProfile.bind(this);
        this.loadTalentsData = this.loadTalentsData.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
        
    }

    componentDidMount() {
        //window.addEventListener('scroll', this.handleScroll);
        this.loadEmployerProfile();
        this.loadTalentsData();
        this.init()
    };

    loadEmployerProfile() {
        const link = profileUrl + "/profile/getEmployerProfile";
        const cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                "Authorization": "bearer " + cookies,
                "Content-Type": "application/json"
            },
            type: "GET",
            success: function (res) {
                console.log(res);
                if (res.success == true) {
                    this.setState({
                        companyContact: res.employer.companyContact,
                        skills: res.employer.skills
                    });
                }
                else {
                    ;
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res);
                console.log(a);
                console.log(b);
            }
        })
    }

    loadTalentsData() {
        const link = profileUrl + "/profile/getTalentList";
        const cookies = Cookies.get("talentAuthToken");
        $.ajax({
            url: link,
            headers: {
                "Authorization": "bearer " + cookies,
                "Content-Type": "application/json"
            },
            type: "GET",
            success: function (res) {
                console.log(res);
                if (res.success == true) {
                    this.setState({
                        talents: res.data
                    })
                }
                else {

                }
            }.bind(this),
            error: function (res, a, b) {
                console.log(res);
                console.log(a);
                console.log(b);
            }
        })
    }

    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="talent-feed">
                                <div className="ui form">
                                    <div className="ui grid">
                                        <div className="row">
                                            <div className="ui four wide column">
                                                <CompanyProfile
                                                    companyContact={this.state.companyContact}
                                                    skills={this.state.skills} />
                                            </div>
                                            <div className="ui eight wide column">
                                                <TalentCard
                                                    talents={this.state.talents} />
                                            </div>
                                            <div className="ui four wide column">
                                                <FollowingSuggestion />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}