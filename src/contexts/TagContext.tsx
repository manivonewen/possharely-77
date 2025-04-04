import React, { createContext, useContext } from 'react';

interface Tag {
  name: string;
  color: string;
  textColor: string;
  isDriver?: boolean; // Add optional isDriver property
}

const tags: Tag[] = [
  { name: 'POS', color: 'bg-green-700', textColor: 'text-green-900' },
  { name: 'Brand', color: 'bg-purple-900', textColor: 'text-purple-300' },
  { name: 'Supplier', color: 'bg-orange-700', textColor: 'text-orange-900' },
  { name: 'View', color: 'bg-blue-700', textColor: 'text-blue-900' },
  { name: 'Driver', color: 'bg-pink-700', textColor: 'text-pink-900', isDriver: true }, // Assign isDriver property
];

interface TagContextProps {
  tags: Tag[];
}

const TagContext = createContext<TagContextProps>({ tags });

export const TagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <TagContext.Provider value={{ tags }}>{children}</TagContext.Provider>;
};

export const useTags = () => useContext(TagContext);
