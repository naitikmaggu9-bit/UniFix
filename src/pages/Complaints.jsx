import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useComplaints } from "../context/ComplaintContext";
import useDebounce from "../hooks/useDebounce";
import ComplaintCard from "../components/ComplaintCard";
import QuickViewModal from "../components/complaints/QuickViewModal";
import Pagination from "../components/common/Pagination";
import SkeletonLoader from "../components/common/SkeletonLoader";
import EmptyState from "../components/common/EmptyState";
import "./Complaints.css";

/**
 * Smart Complaint Explorer Component (UniFix 2.0)
 * Demonstrates: Debounced multi-field search, multi-axis filtering, sorting algorithms,
 * grid/list view toggle, controlled pagination, useSearchParams synchronization, useRef focus.
 * (Syllabus: Lectures 31-36, Lectures 61-66, Lectures 67-72)
 */
export function Complaints() {
  const { complaints, loading } = useComplaints();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input with debounce hook
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 250);

  // Filters initialized from URL query params if present
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get("status") || "All");
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get("category") || "All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const searchInputRef = useRef(null);
  const pageSize = 6;

  // Filter options
  const statusOptions = ["All", "Pending", "Under Review", "In Progress", "Resolved"];
  const categoryOptions = [
    "All",
    "Wi-Fi",
    "Electricity",
    "Water",
    "Cleanliness",
    "Hostel",
    "Maintenance"
  ];
  const priorityOptions = ["All", "High", "Medium", "Low"];

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Sync with URL query parameters when props change
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategoryFilter(cat);
    const st = searchParams.get("status");
    if (st) setStatusFilter(st);
  }, [searchParams]);

  // Multi-field filtering and sorting using useMemo
  const filteredAndSorted = useMemo(() => {
    let result = [...complaints];

    // 1. Status Filter
    if (statusFilter !== "All") {
      result = result.filter((item) => {
        const itemStatus = (item.status || "").toLowerCase();
        const target = statusFilter.toLowerCase();
        if (target === "pending") {
          return itemStatus === "pending" || itemStatus === "submitted";
        }
        return itemStatus === target;
      });
    }

    // 2. Category Filter
    if (categoryFilter !== "All") {
      result = result.filter((item) =>
        item.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // 3. Priority Filter
    if (priorityFilter !== "All") {
      result = result.filter(
        (item) => (item.priority || "Medium").toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // 4. Debounced Search across Title, Description, Location, ID, and Student
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter((item) => {
        const idMatch = String(item.id).includes(q) || `#UNIFIX-${String(item.id).slice(-4)}`.toLowerCase().includes(q);
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const descMatch = (item.description || "").toLowerCase().includes(q);
        const locMatch = (item.location || "").toLowerCase().includes(q);
        const catMatch = (item.category || "").toLowerCase().includes(q);
        const studentMatch = (item.studentName || "").toLowerCase().includes(q);

        return idMatch || titleMatch || descMatch || locMatch || catMatch || studentMatch;
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return Number(b.id) - Number(a.id);
      }
      if (sortBy === "oldest") {
        return Number(a.id) - Number(b.id);
      }
      if (sortBy === "upvotes") {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      if (sortBy === "priority") {
        const pWeights = { high: 3, medium: 2, low: 1 };
        const wA = pWeights[(a.priority || "medium").toLowerCase()] || 2;
        const wB = pWeights[(b.priority || "medium").toLowerCase()] || 2;
        return wB - wA;
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return result;
  }, [complaints, statusFilter, categoryFilter, priorityFilter, debouncedSearch, sortBy]);

  // Pagination calculation
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedComplaints = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  const hasActiveFilters =
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    priorityFilter !== "All" ||
    Boolean(debouncedSearch.trim());

  const resetAllFilters = () => {
    setSearchInput("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setSortBy("newest");
    setSearchParams({});
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  return (
    <div className="complaints-page container animate-fade-in">
      {/* Header */}
      <div className="complaints-header">
        <div>
          <span className="badge-tag">Chitkara University Public Feed</span>
          <h1 className="page-title">Smart Complaint Explorer</h1>
          <p className="page-subtitle">
            Search, filter, and track community-reported facility issues with live upvoting and transparent resolution histories.
          </p>
        </div>

        <Link to="/report" className="btn btn-primary">
          + Report Campus Issue
        </Link>
      </div>

      {/* Explorer Controls: Search + Sort + View */}
      <div className="explorer-controls">
        <div className="search-and-view-row">
          {/* Debounced Search with clear button */}
          <div className="search-box-wrapper">
            <span className="search-icon-prefix" aria-hidden="true">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input-field"
              placeholder="Search by ticket #, keyword, location, or student..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search complaints"
            />
            {searchInput && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setSearchInput("");
                  if (searchInputRef.current) searchInputRef.current.focus();
                }}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>

          <div className="sort-and-view">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort complaints by"
            >
              <option value="newest">🕒 Newest First</option>
              <option value="oldest">⏳ Oldest First</option>
              <option value="upvotes">👍 Most Upvoted</option>
              <option value="priority">🔥 High Priority</option>
              <option value="title">🔤 Title (A-Z)</option>
            </select>

            {/* Grid / List View Toggle */}
            <div className="view-toggle-group" role="group" aria-label="Layout view mode">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid layout"
                aria-pressed={viewMode === "grid"}
              >
                ⊞
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List layout"
                aria-pressed={viewMode === "list"}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips: Status, Category, Priority */}
        <div className="filter-groups-row">
          {/* Status chips */}
          <div className="filter-group">
            <span className="filter-group-label">Status:</span>
            {statusOptions.map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-chip ${statusFilter.toLowerCase() === st.toLowerCase() ? "active" : ""}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div className="filter-group">
            <span className="filter-group-label">Category:</span>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-chip ${categoryFilter.toLowerCase().includes(cat.toLowerCase()) && categoryFilter !== "All" ? "active" : cat === "All" && categoryFilter === "All" ? "active" : ""}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Priority chips */}
          <div className="filter-group">
            <span className="filter-group-label">Priority:</span>
            {priorityOptions.map((p) => (
              <button
                key={p}
                type="button"
                className={`filter-chip ${priorityFilter.toLowerCase() === p.toLowerCase() ? "active" : ""}`}
                onClick={() => setPriorityFilter(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="active-filters-summary">
        <div>
          Showing <strong>{filteredAndSorted.length}</strong> matches of{" "}
          <strong>{complaints.length}</strong> campus complaints
        </div>

        {hasActiveFilters && (
          <div className="active-chip-pills">
            <span>Filtered by:</span>
            {statusFilter !== "All" && <span className="active-pill">Status: {statusFilter}</span>}
            {categoryFilter !== "All" && <span className="active-pill">Category: {categoryFilter}</span>}
            {priorityFilter !== "All" && <span className="active-pill">Priority: {priorityFilter}</span>}
            {debouncedSearch && <span className="active-pill">Keyword: "{debouncedSearch}"</span>}
            <button type="button" className="clear-all-link" onClick={resetAllFilters}>
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Content: Loading Skeleton, Complaint Cards, or Empty State */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : paginatedComplaints.length > 0 ? (
        <>
          <div className={viewMode === "grid" ? "complaints-grid-view" : "complaints-list-view"}>
            {paginatedComplaints.map((item) => (
              <ComplaintCard
                key={item.id}
                complaint={item}
                onQuickView={(c) => setSelectedComplaint(c)}
              />
            ))}
          </div>

          {/* Controlled Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(pg) => setCurrentPage(pg)}
          />
        </>
      ) : (
        <EmptyState
          icon="🔍"
          title="No complaints matched your search"
          description="Try broadening your search query or resetting filters to view all campus grievances."
          actionLabel="Reset All Filters"
          onAction={resetAllFilters}
        />
      )}

      {/* Quick View Accessible Modal */}
      {selectedComplaint && (
        <QuickViewModal
          complaint={selectedComplaint}
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}

export default Complaints;
