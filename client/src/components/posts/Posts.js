import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { getPosts, addPost } from '../../action/post';
import Post from "./PostItem";
import PostForm from "./PostForm";

const Posts = ({getPosts, post: { posts, loading }, auth: {isAuthenticated}}) => {
   useEffect(() => {
       getPosts();
   }, [getPosts]);


    return (
        <Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead">
                <i className="fas fa-user"></i> Welcome to the community!
            </p>

            <PostForm/>

            {posts.length > 0 ?

                <div className="posts">
                    {posts.map(post => (
                        <Post key={post._id} post={post}/>
                    ))}
                </div>
                :
                null
            }

        </Fragment>
    );
};

const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
})

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, { getPosts })(Posts);
