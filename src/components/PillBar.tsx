import React, { useState } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTags } from '@/contexts/TagContext';
import { Contact } from '@/lib/types'; // Import Contact type

interface PillBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  contacts: Contact[]; // Add contacts prop
}

const PillBar: React.FC<PillBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  contacts, // Destructure contacts
}) => {
  const { tags } = useTags();
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [isTagRowVisible, setIsTagRowVisible] = useState(false);
  const [isViewOptionsVisible, setIsViewOptionsVisible] = useState(false); // Track visibility of view options
  const [isCategoryOptionsVisible, setIsCategoryOptionsVisible] = useState(false); // Track visibility of category options
  const [isContactsOptionsVisible, setIsContactsOptionsVisible] = useState(false); // Track visibility of contacts options
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Track view mode

  const categories = ['All', 'Beverages', 'Bakery', 'Food']; // Example categories

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row">
      <div className="flex gap-2 flex-wrap">
        {/* Search Pill */}
        <button
          onClick={() => setIsSearchBarVisible((prev) => !prev)}
          className="px-4 py-2 text-sm rounded-full bg-orange-300 text-orange-800 hover:bg-orange-400 transition-colors"
        >
          <Search className="inline h-4 w-4" />
        </button>

        {/* Tag Pill */}
        <button
          onClick={() => setIsTagRowVisible((prev) => !prev)}
          className="px-4 py-2 text-sm rounded-full bg-yellow-300 text-yellow-800 hover:bg-yellow-400 transition-colors"
        >
          Tags
        </button>

        {/* CATEGORY Parent Pill */}
        <button
          onClick={() => setIsCategoryOptionsVisible((prev) => !prev)}
          className="px-4 py-2 text-sm rounded-full bg-green-300 text-green-800 hover:bg-green-400 transition-colors"
        >
          CATEGORY
        </button>

        {/* View Parent Pill */}
        <button
          onClick={() => setIsViewOptionsVisible((prev) => !prev)}
          className="px-4 py-2 text-sm rounded-full bg-blue-300 text-blue-800 hover:bg-blue-400"
        >
          View
        </button>

        {/* Contacts Parent Pill */}
        <button
          onClick={() => setIsContactsOptionsVisible((prev) => !prev)}
          className="px-4 py-2 text-sm rounded-full bg-pink-300 text-pink-800 hover:bg-pink-400"
        >
          Contacts
        </button>
      </div>

      {/* Search Bar */}
      {isSearchBarVisible && (
        <div className="relative w-1/2 sm:w-1/3 lg:w-1/4 mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Tag Row */}
      {isTagRowVisible && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag.name}
              className={`px-4 py-2 text-sm rounded-full ${tag.color} ${tag.textColor} hover:opacity-90`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* CATEGORY Child Pills */}
      {isCategoryOptionsVisible && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                selectedCategory === category || (category === 'All' && selectedCategory === null)
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* View Child Pills */}
      {isViewOptionsVisible && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm rounded-full ${
              viewMode === 'list' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <List className="inline h-4 w-4 mr-2" /> List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm rounded-full ${
              viewMode === 'grid' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Grid className="inline h-4 w-4 mr-2" /> Grid
          </button>
        </div>
      )}

      {/* Contacts Child Pills */}
      {isContactsOptionsVisible && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              className="px-4 py-2 text-sm rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200"
            >
              {contact.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PillBar;
