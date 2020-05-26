import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { getCurrentProfile, deleteAccount } from '../../action/profiles';
import DashboardAction from "./DashboardAction";
import Experience from "./Experience";
import Education from "./Education";

import PropTypes from 'prop-types';


const Dashboard = ({ getCurrentProfile, deleteAccount, auth: {user}, profile: {profile, loading} }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  if (loading && profile === null) {

    return <Spinner />

  } else {
    return (
        <Fragment>
          <section className="container">
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead"><i className="fas fa-user"></i> Welcome {user && user.name}</p>

            {profile !== null ?
              <Fragment>

                <DashboardAction />

                {(profile.education.length > 0) ? <Experience experience={profile.experience} /> : ''}

                {(profile.education.length > 0) ? <Education education={profile.education} /> : ''}

                <div className="my-2">
                  <button onClick={deleteAccount} className="btn btn-danger">
                    <i className="fas fa-user-minus"></i>
                    Delete My Account
                  </button>
                </div>
              </Fragment>

              :

              <Fragment>
                <p>You hav not yet setup profile, please add some info</p>
                <Link to='/create-profile' className="btn btn-primary my-1">Create profile</Link>
              </Fragment>
            }
          </section>
        </Fragment>
    );
  }
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
