import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import { getProfileById } from "../../action/profiles";
import Spinner from "../layout/Spinner";

import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import Experience from "./Experience";
import Education from "./Education";
import ProfileGithub from "./ProfileGithub";




const Profile = ({match: {params} ,getProfileById, profile: { loading, profile, repos}, auth: { isAuthenticated, user}}) => {
    useEffect(() => {
        getProfileById(params.id)
    }, [getProfileById, params.id]);

    return (
        (profile === null || loading ? <Spinner /> :
            <Fragment>

                <Link to="/profiles" className="btn btn-light">Back To Profiles</Link>

                {
                    isAuthenticated && loading === false && user._id === profile.user._id && (<Link to='/edit-profile' className="btn btn-dark">Edit Profile</Link>)
                }

                <div className="profile-grid my-1">

                    <ProfileTop profile={profile}/>

                    <ProfileAbout profile={profile}/>

                    {profile.experience.length > 0
                        ? <Experience experience={profile.experience}/>
                        :
                        null
                    }

                    {profile.experience.length > 0
                        ?
                        <Education education={profile.education}/>
                        :
                        null
                    }
                    {profile.githubusername ?
                        <ProfileGithub githubsuername={profile.githubusername}/>
                        :
                        null
                    }

                </div>
            </Fragment>)
    );
};

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })( Profile );
