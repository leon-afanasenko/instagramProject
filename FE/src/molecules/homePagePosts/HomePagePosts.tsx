import React from "react";

import { $api } from "../../api/api";
import { IFollowItem } from "../../interfaces/follow.interface";
import HomePostModal from "./HomePagePostModal";
import styles from "./HomePagePosts.module.css";
import PostItem from "./PostItem";

type Post = {
  _id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
  user_name: string;
  profile_image: string;
  likes_count?: number;
  comments_count?: number;
  last_comment?: string;
};

type State = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  likesCounts: { [key: string]: number };
  selectedPost: Post | null;
  followingList: string[] | null;
};

class HomePagePosts extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      error: null,
      likesCounts: {},
      followingList: null,
      selectedPost: null,
    };
  }

  componentDidMount() {
    this.getAllPosts();
  }

  getAllPosts = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await $api.get("/post/all/public");
      const allPosts = response.data;

      const filteredPosts = allPosts.filter(
        (post: Post) => post.user_id !== userId
      );

      const shuffledPosts = filteredPosts.sort(() => Math.random() - 0.5);

      const postsWithLastComment = await Promise.all(
        shuffledPosts.map(async (post: Post) => {
          try {
            const commentsResponse = await $api.get(`/comments/${post._id}`);
            const comments = commentsResponse.data || [];
            post.last_comment =
              comments.length > 0
                ? comments[comments.length - 1].comment_text
                : "";
          } catch {
            post.last_comment = "No comments yet";
          }
          return post;
        })
      );

      const initialLikesCounts = postsWithLastComment.reduce(
        (acc: { [key: string]: number }, post: Post) => {
          acc[post._id] = post.likes_count || 0;
          return acc;
        },
        {}
      );

      this.setState({
        posts: postsWithLastComment,
        likesCounts: initialLikesCounts,
        loading: false,
      });
    } catch (error) {
      this.setState({ error: "Ошибка при загрузке постов", loading: false });
    }
  };

  handleLikesCountChange = (postId: string, newCount: number) => {
    this.setState((prevState) => ({
      likesCounts: {
        ...prevState.likesCounts,
        [postId]: newCount,
      },
    }));
  };

  openModal = (post: Post) => {
    this.setState({ selectedPost: post });
  };

  closeModal = () => {
    this.setState({ selectedPost: null });
  };

  handleCheckMyFollowing = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "");

    try {
      const response = await $api.get(`/follow/${user._id}/following`);
      const data: string[] = response.data.map(
        (followItem: IFollowItem) => followItem.user_id
      );
      this.setState({
        ...this.state,
        followingList: [...data],
      });
    } catch (error) {
      console.error("Ошибка при проверке подписки:", error);
    }
  };

  handleRemoveSomeFollow = (userId: string) => {
    if (this.state.followingList) {
      const newList = this.state.followingList.filter(
        (candidate) => candidate !== userId
      );
      this.setState({ ...this.state, followingList: newList });
    }
  };
  handleAddSomeFollow = (userId: string) => {
    if (this.state.followingList) {
      this.setState({
        ...this.state,
        followingList: [...this.state.followingList, userId],
      });
    }
  };

  render() {
    const { posts, loading, error, likesCounts, selectedPost } = this.state;
    if (this.state.followingList === null) {
      this.handleCheckMyFollowing();
    }
    if (loading) return <p>loading...</p>;
    if (error) return <p>{error}</p>;

    return (
      <div>
        <ul className={styles.postsContainer}>
          {posts.map((post) => (
            <PostItem
              handleRemoveSomeFollow={this.handleRemoveSomeFollow}
              handleAddSomeFollow={this.handleAddSomeFollow}
              listFollowing={this.state.followingList}
              key={post._id}
              item={post}
              likesCount={likesCounts[post._id] || 0}
              setLikesCount={this.handleLikesCountChange}
              onClick={() => this.openModal(post)}
            />
          ))}
        </ul>

        {selectedPost && (
          <HomePostModal post={selectedPost} onClose={this.closeModal} />
        )}
      </div>
    );
  }
}

export default HomePagePosts;
