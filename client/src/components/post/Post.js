import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom'
import {connect} from "react-redux";
import {getPost} from "../../action/post";
import Spinner from "../layout/Spinner";
import Comment from "./Comment";
import PostForm from "./CommentForm";
import PostText from "./PostText";
import PostItem from '../posts/PostItem'

const Post = ({match: {params}, getPost, post: {post, loading}}) => {
    useState(() => {
        getPost(params.id)
    }, [getPost, params.id])

    return post === null && loading ? <Spinner/> :
        <Fragment>

            <Link to="/posts" className="btn">Back To Posts</Link>

            <PostItem post={post} showActions={false} />

            <PostForm postId={post._id}/>

            <div className="comments">
                {!loading &&
                    (post.comments.length > 0 ? (

                            post.comments.map( comment => {
                                return <Comment key={comment._id} comment={comment} postId={post._id}/>
                            })

                        ) : <span>No Comment</span>)
                }
            </div>
        </Fragment>

};

const mapStateToProps = state => ({
    post: state.post,
})

Post.propTypes = {}

export default connect(mapStateToProps, {getPost})(Post);
