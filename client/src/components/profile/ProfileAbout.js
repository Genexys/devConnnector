import React,{ Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({profile: {user: { name }, bio, skills}}) => {

    const skill = skills.map( (skill, index) => (
        <div key={index} className="p-1"><i className="fa fa-check"></i> {skill}</div>
    ))

    return (
        <div className="profile-about bg-light p-2">
            {bio && (
                <Fragment>
                    <h2 className="text-primary">bio</h2>
                    <p>
                        {bio}
                    </p>
                </Fragment>
            )
            }
            <div className="line"></div>
            <h2 className="text-primary">Skill Set</h2>
            <div className="skills">
                {skill}
            </div>
        </div>
    )
}

export default ProfileAbout;


