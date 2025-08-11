"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit, Clock } from "lucide-react";
import type { TextLayer, MediaLayer, ImageFilters } from "./ImageEditor";

interface DraftData {
  id: string;
  name: string;
  timestamp: number;
  originalImageUrl: string;
  canvasState: object;
  textLayers: TextLayer[];
  mediaLayers: MediaLayer[];
  imageFilters: ImageFilters;
  canvasWidth: number;
  canvasHeight: number;
}

interface DraftManagerProps {
  onLoadDraft: (draftId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function DraftManager({ onLoadDraft, onClose, isOpen }: DraftManagerProps) {
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = () => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('imageDrafts') || '[]');
      // Sort by timestamp (newest first)
      savedDrafts.sort((a: DraftData, b: DraftData) => b.timestamp - a.timestamp);
      setDrafts(savedDrafts);
    } catch (error) {
      console.error('Failed to load drafts:', error);
      setDrafts([]);
    }
  };

  const deleteDraft = (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
      setDrafts(updatedDrafts);
      localStorage.setItem('imageDrafts', JSON.stringify(updatedDrafts));
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const renameDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;

    const newName = prompt('Enter new name:', draft.name);
    if (!newName || newName === draft.name) return;

    try {
      const updatedDrafts = drafts.map(d => 
        d.id === draftId ? { ...d, name: newName } : d
      );
      setDrafts(updatedDrafts);
      localStorage.setItem('imageDrafts', JSON.stringify(updatedDrafts));
    } catch (error) {
      console.error('Failed to rename draft:', error);
    }
  };

  const filteredDrafts = drafts.filter(draft =>
    draft.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Draft Manager
            </h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
          
          {/* Search */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredDrafts.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">
                {drafts.length === 0 ? 'No drafts saved' : 'No drafts found'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {drafts.length === 0 
                  ? 'Start editing an image and save it as a draft to see it here.'
                  : 'Try adjusting your search terms.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
                >
                  {/* Draft Preview */}
                  <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={draft.originalImageUrl}
                      alt={draft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Draft Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {draft.name}
                    </h3>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>{new Date(draft.timestamp).toLocaleDateString()}</p>
                      <p>
                        {draft.textLayers.length} text layers, {draft.mediaLayers.length} media layers
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          onLoadDraft(draft.id);
                          onClose();
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Load
                      </button>
                      
                      <button
                        onClick={() => renameDraft(draft.id)}
                        className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        title="Rename draft"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}