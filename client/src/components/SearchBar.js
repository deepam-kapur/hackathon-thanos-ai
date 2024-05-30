import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchWrapper = styled.div`
  margin: 3rem auto;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 50%;
  max-width: 600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  margin-left: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #218838;
  }
`;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <SearchWrapper>
      <form onSubmit={handleSubmit}>
        <SearchInput style={{ width: "500px" }}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything..."
        />
        <SearchButton type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </SearchButton>
      </form>
    </SearchWrapper>
  );
};

export default SearchBar;
