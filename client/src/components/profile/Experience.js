import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import moment from "moment";

const Experience = ({experience}) => {

    const experienceArr = experience.map( exp => (
        <div key={exp._id}>
            <h3 className="text-dark">{exp.company}</h3>
            <p>{
                <Moment format="DD-MM-YYYY">
                    {moment.utc(exp.from)}
                </Moment>
            } - {exp.current ?
                'now'
                :
                <Moment format="DD-MM-YYYY">
                    {moment.utc(exp.to)}
                </Moment>

            }</p>
            <p><strong>Position: </strong>{exp.title}</p>

            {exp.description ? <p>
                <strong>Description: </strong>{exp.description}
            </p> : null}
        </div>
    ))

    return (
        <Fragment>
            <div className="profile-exp bg-white p-2">
                <h2 className="text-primary">Experience</h2>
                {experienceArr}
            </div>
        </Fragment>
    )
}

Experience.propType = {
    experience: PropTypes.array.isRequired,
}

export default Experience;
