export interface IFollowItem {
  user_id: {
    _id: string;
  };
  follower_user_id: {
    username: string;
    _id: string;
  };
  created_at: Date;
}

export interface ILocalFollow {
  followers: "Loading.." | number;
  following: "Loading.." | number;
}
