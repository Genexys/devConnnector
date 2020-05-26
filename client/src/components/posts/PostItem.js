import React, {Fragment} from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import {Link} from 'react-router-dom'
import {connect} from "react-redux";
import {addLike, deletePost, removeLike} from "../../action/post";
import PropTypes from "prop-types";


const PostItem = ({post, auth: {loading, user}, deletePost, addLike, removeLike, showActions}) => {

    return (
        <div className="posts">
            <div className="post bg-white p-1 my-1">
                <div>
                    <Link to={`profile/${post.user}`}>
                        <img
                            className="round-img"
                            src={post.avatar}
                            alt=""
                        />
                        <h4>{post.name}</h4>
                    </Link>
                </div>
                <div>
                    <p className="my-1">
                        {post.text}
                    </p>
                    <p className="post-date">
                        Posted on
                        &nbsp;
                        <Moment format="DD/MM/YYYY">
                            {moment.utc(post.date)}
                        </Moment>
                    </p>

                    {showActions &&

                        <Fragment>
                            <button onClick={ () => addLike(post._id)} type="button" className="btn btn-light">
                                <i className="fas fa-thumbs-up"></i>
                                {post.likes.length > 0 && <span>{post.likes.length}</span>}
                            </button>
                            <button onClick={ () => removeLike(post._id)} type="button" className="btn btn-light">
                                <i className="fas fa-thumbs-down"></i>
                            </button>
                            <Link to={`/post/${post._id}`} className="btn btn-primary">
                                Discussion {post.comments.length > 0 && (<span className="comment-count">{post.comments.length}</span>)}
                            </Link>

                            {
                                !loading && post.user === user._id && (
                                    <button onClick={() => deletePost(post._id)} type="button" className="btn btn-danger">
                                        <i className="fas fa-times"></i>
                                    </button>
                                )
                            }
                        </Fragment>
                    }


                </div>
            </div>

        </div>
    );
};

PostItem.defaultProps = {
    showActions: true
}

PostItem.propTypes = {
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})


export default connect(mapStateToProps, {deletePost, addLike, removeLike})(PostItem);
