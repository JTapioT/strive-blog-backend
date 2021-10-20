import React, { Component } from "react";
import { Container, Image } from "react-bootstrap";
import { withRouter } from "react-router";
import BlogAuthor from "../../components/blog/blog-author";
import BlogLike from "../../components/likes/BlogLike";
//import posts from "../../data/posts.json";  Maybe instead of file, fetch?
import "./styles.css";
class Blog extends Component {
  state = {
    blog: {},
    loading: true,
  };

  async fetchBlogPost() {
    // Fetch all blog posts:
    let response = await fetch("http://localhost:3001/blogPosts");

    if (response.ok) {
      let blogPosts = await response.json();
      // Find blog post by id:
      const { id } = this.props.match.params;
      const blog = blogPosts.find((post) => post._id.toString() === id)
      if (blog) {
        this.setState({ blog, loading: false });
      } else {
        this.props.history.push("/404");
      }
    }
  }

  componentDidMount() {
    this.fetchBlogPost();

    /* const { id } = this.props.match.params;
    console.log(posts);
    const blog = posts.find((post) => post._id.toString() === id);
    if (blog) {
      this.setState({ blog, loading: false });
    } else {
      this.props.history.push("/404");
    } */
  }

  render() {
    const { loading, blog } = this.state;
    if (loading) {
      return <div>loading</div>;
    } else {
      return (
        <div className="blog-details-root">
          <Container>
            <Image className="blog-details-cover" src={blog.cover} fluid />
            <h1 className="blog-details-title">{blog.title}</h1>

            <div className="blog-details-container">
              <div className="blog-details-author">
                <BlogAuthor {...blog.author} />
              </div>
              <div className="blog-details-info">
                <div>{blog.createdAt}</div>
                <div>{`${blog.readTime.value} ${blog.readTime.unit} read`}</div>
                <div style={{ marginTop: 20 }}>
                  <BlogLike defaultLikes={["123"]} onChange={console.log} />
                </div>
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          </Container>
        </div>
      );
    }
  }
}

export default withRouter(Blog);
