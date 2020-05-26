import React, {Fragment, useEffect} from 'react';
import { connect } from "react-redux";
import { getGithubRepose } from "../../action/profiles";
import Spinner from "../layout/Spinner";

import PropTypes from 'prop-types';

const ProfileGithub = ({getGithubRepose, githubsuername, repos}) => {
    useEffect(() => {
        getGithubRepose(githubsuername)
    }, [getGithubRepose])

    return (
        <Fragment>
            <div className="profile-github">
                <h2 className="text-primary my-1">
                    <i className="fab fa-github"></i> Github Repos
                </h2>

                {repos === null ? <Spinner /> :

                    <Fragment>
                        {repos.map( rep => (
                            <div key={rep.id} className="repo bg-white p-1 my-1">
                                <div>
                                    <h4><a href={rep.html_url} target="_blank"
                                           rel="noopener noreferrer">{rep.name}</a></h4>
                                    {rep.description &&
                                    (<p>
                                        {rep.description}
                                    </p>)}
                                </div>
                                <div>
                                    <ul>
                                        <li className="badge badge-primary">Stars: {rep.stargazers_count}</li>
                                        <li className="badge badge-dark">Watchers: {rep.watchers_count}</li>
                                        <li className="badge badge-light">Forks: {rep.forks_count}</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </Fragment>

                }
            </div>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    repos: state.profile.repos,
})

export default connect(mapStateToProps, { getGithubRepose })(ProfileGithub);
