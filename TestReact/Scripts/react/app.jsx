var data = [
    { id: 1, author: "1Daniel Lo Nigro", text: "Hello ReactJS.NET World!" },
    { id: 2, author: "2Pete Hunt", text: "This is one comment" },
    { id: 3, author: "3Jordan Walke", text: "This is *another* comment" }
];

var Comment = React.createClass({
    getInitialState: function () {
        return { removing: false };
    },
    raiseOnClickRemove: function ()
    {
        this.props.onClickRemove(this.props);
        this.setState({ removing: true });
    },
    render: function () {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
                {this.state.removing ? <div>removing ...</div>: null}
                <button onClick={this.raiseOnClickRemove}>Remove</button>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function () {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author} key={comment.id} id={comment.id} onClickRemove={this.props.onCommentRemove}>
                    {comment.text}
                </Comment>
            );
        }.bind(this));

        return (
            <div className="commentList">                
                {commentNodes}                
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function () {
        return { author: '', text: '' };
    },
    handleAuthorChange: function (e) {
        this.setState({ author: e.target.value });
    },
    handleTextChange: function (e) {
        this.setState({ text: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }

        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    },
    render: function () {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
                <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer: function () {
        this.setState({ loading: true });
        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data, loading: false });
        }.bind(this);
        xhr.send();
    },
    handleCommentSubmit: function (comment) {
        this.setState({ loading: true });
        $.post(this.props.submitUrl, comment).done(function ()
        {
            this.loadCommentsFromServer();
        }.bind(this));
    },
    getInitialState: function () {
        return { data: [], loading: false };
    },
    componentWillMount: function() {
        this.loadCommentsFromServer();
    },

    handleCommentRemove: function (model) {
        this.setState({ loading: true });
        $.post(this.props.removeUrl, { id: model.id }).done(function () {
            this.loadCommentsFromServer();
        }.bind(this));
    },
    /*componentDidMount: function () {
        this.loadCommentsFromServer();
        window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },*/
    render: function () {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                {this.state.loading ? <div className="CommentLoading">Loading ...</div> : null}
                {/* <CommentList data={this.props.data} /> */}
                <CommentList data={this.state.data} onCommentRemove={this.handleCommentRemove} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

ReactDOM.render(
    /*<CommentBox data={data} />,*/
    <CommentBox url="/Home/comments" submitUrl="/Home/AddComment" removeUrl="/Home/RemoveComment" pollInterval={2000} />,    
    document.getElementById('content')
);