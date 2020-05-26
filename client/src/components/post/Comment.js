import React from 'react';
import { connect } from "react-redux";
import Moment from 'react-moment';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deleteComment } from "../../action/post";
import PropTypes from "prop-types";

const Comment = ({auth, postId, comment: { _id, user, name, avatar, text, date}, deleteComment}) => {

    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img"
                        src={avatar}
                        alt=""
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">
                    {text}
                </p>
                <p className="post-date">
                    Posted on
                    <Moment format="DD/MM/YYYY">
                        {moment.utc(date)}
                    </Moment>
                </p>
                {
                    !auth.loading && user === auth.user._id && (
                        <button onClick={() => deleteComment(postId, _id)} type="button" className="btn btn-danger">
                            <i className="fas fa-times"></i>
                        </button>
                    )
                }
            </div>
        </div>
    );
};

Comment.propTypes = {
    postId: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,

})

export default connect(mapStateToProps, {deleteComment})(Comment);
