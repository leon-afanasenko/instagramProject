import React, { useState } from "react";
import CustomInput from "../../../atoms/customInput/CustomInput";
import s from "./SearchContent.module.css";

const users = [
  {
    id: 1,
    username: "john_doe",
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    username: "jane_smith",
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    username: "alex_williams",
    name: "Alex Williams",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

const SearchContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredUsers(users);
  };

  return (
    <div>
      <h2>Search</h2>
      <CustomInput
        className={s.searchInput}
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name or username..."
        backgroundColor="#FAFAFA"
        width="344px"
        height="40px"
        borderRadius="8px"
        padding="8px 12px"
        color="#737373"
        margin="0 20px"
        errorMessage="Please enter a search term."
        showError={false}
        clearable={true}
        onClear={handleClearSearch}
      />

      <div className={s.results}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className={s.userItem}>
              <img src={user.avatar} alt={user.name} className={s.avatar} />
              <span>
                {user.name} ({user.username})
              </span>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchContent;
