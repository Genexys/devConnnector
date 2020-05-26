import React, {useState} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {addPost} from "../../action/post";

const PostForm = ({addPost, post}) => {

    const [text, setText] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        addPost({text})
        setText('')

    }


    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form onSubmit={(e) => onSubmit(e)} className="form my-1">
                <textarea name="text" cols="30" rows="5" placeholder="Create a post" required value={text} onChange={ e => setText(e.target.value)}></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    );
}

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {addPost})(PostForm);
