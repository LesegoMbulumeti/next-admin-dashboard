"use client";

import { MdSearch } from "react-icons/md";
import styles from "./search.module.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

interface SearchProps {
  placeholder: string;
}

const Search = ({ placeholder }: SearchProps) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  // Initialize search value from URL params
  useEffect(() => {
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  // Debounced search handler
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    
    // Reset pagination when searching
    params.delete("page");
    
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={styles.container}>
      <MdSearch />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
        aria-label="Search"
      />
    </div>
  );
};

export default Search;