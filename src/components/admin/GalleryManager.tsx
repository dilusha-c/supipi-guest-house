"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, GripVertical, Image as ImageIcon, Loader2, Save } from "lucide-react";

export default function GalleryManager() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/admin/gallery", { cache: "no-store" });
      const data = await res.json();
      if (data.images) {
        setImages(data.images);
      }
    } catch (err) {
      console.error("Failed to fetch images", err);
    } finally {
      setLoading(false);
    }
  };

  const saveUpdates = async (newImages: any[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: newImages }),
      });
      if (!res.ok) alert("Failed to save changes.");
    } catch (err) {
      console.error(err);
      alert("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", "");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchImages();
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleCaptionChange = (id: string, newCaption: string) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, caption: newCaption } : img
    );
    setImages(updatedImages);
  };

  const handleCaptionBlur = (id: string) => {
    // Only save when the user finishes typing (on blur)
    const updatedImages = images.map((img, index) => ({ ...img, order: index }));
    saveUpdates(updatedImages);
  };

  // Drag and drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    const newImages = [...images];
    const draggedImg = newImages[draggedIdx];
    
    // Remove from old position
    newImages.splice(draggedIdx, 1);
    // Insert into new position
    newImages.splice(idx, 0, draggedImg);
    
    // Update order values based on array index
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      order: index
    }));

    setDraggedIdx(idx);
    setImages(reorderedImages);
  };

  const handleDrop = () => {
    setDraggedIdx(null);
    // Trigger API save with new order
    saveUpdates(images);
  };

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-light-border overflow-hidden">
      <div className="p-6 md:p-8 border-b border-light-border flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading text-forest mb-2">Photo Gallery</h2>
          <p className="text-sm text-muted">Manage the photos displayed on the public gallery page. Drag to reorder.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {saving && <span className="text-sm text-sage flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</span>}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {loading ? (
          <div className="text-center py-12 text-muted">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-light-border rounded-xl">
            <ImageIcon className="w-12 h-12 mx-auto text-muted/50 mb-3" />
            <p className="text-muted">No photos yet. Click "Upload Photo" to add one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {images.map((img, idx) => (
              <div 
                key={img.id} 
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={handleDrop}
                onDragEnd={() => setDraggedIdx(null)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  draggedIdx === idx ? "border-sage bg-sage/5 opacity-50 shadow-inner" : "border-light-border bg-[#FAF9F6] hover:shadow-sm"
                }`}
              >
                <div className="cursor-move text-muted hover:text-dark">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="w-20 h-16 rounded-lg bg-gray-200 overflow-hidden relative shrink-0">
                  <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <input 
                    type="text" 
                    value={img.caption}
                    onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                    onBlur={() => handleCaptionBlur(img.id)}
                    className="w-full bg-white border border-light-border rounded-lg focus:ring-1 focus:ring-sage focus:border-sage p-2 text-dark font-medium placeholder:text-muted/50 transition-colors"
                    placeholder="Add a caption..."
                  />
                  <div className="text-xs text-muted mt-2 truncate">{img.url}</div>
                </div>

                <button 
                  onClick={() => handleDelete(img.id)}
                  className="p-2 text-red-500/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
