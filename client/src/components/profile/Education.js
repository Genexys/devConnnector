import React, {Fragment} from 'react';
import Moment from "react-moment";
import moment from "moment";
import PropTypes from 'prop-types';

const Education = ({education}) => {

    const educationArr = education.map( edu => (
        <div key={edu._id}>
            <h3>{edu.school}</h3>

            <p>{
                <Moment format="DD-MM-YYYY">
                    {moment.utc(edu.from)}
                </Moment>
            } - {edu.current ?
                'now'
                :
                <Moment format="DD-MM-YYYY">
                    {moment.utc(edu.to)}
                </Moment>

            }</p>
            <p><strong>Degree: </strong>{edu.degree}</p>
            <p><strong>Field Of Study: </strong>{edu.fieldofstudy}</p>

            {edu.description ? <p>
                <strong>Description: </strong>{edu.description}
            </p> : null}
        </div>
    ))

    return (
        <Fragment>
            <div className="profile-edu bg-white p-2">
                <h2 className="text-primary">Education</h2>
                {educationArr}
            </div>

        </Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
}

export default Education;
