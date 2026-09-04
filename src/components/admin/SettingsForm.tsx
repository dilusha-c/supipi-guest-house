"use client";

import { useState } from "react";
import { Save } from "lucide-react";

type Settings = {
  basePrice: number;
  hidePrice: boolean;
};

export default function SettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ text: "Settings saved successfully!", type: "success" });
      } else {
        setMessage({ text: "Failed to save settings.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-light-border p-6 md:p-8 max-w-2xl">
      <h2 className="text-2xl font-heading text-forest mb-6">Pricing & Display Settings</h2>
      
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Base Room Price (per night)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">LKR</span>
            <input 
              type="number" 
              step="0.01"
              value={settings.basePrice}
              onChange={(e) => setSettings({ ...settings, basePrice: parseFloat(e.target.value) || 0 })}
              className="w-full pl-12 pr-4 py-3 rounded-[12px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50"
            />
          </div>
          <p className="text-sm text-muted mt-2">The default price displayed on the website.</p>
        </div>

        {/* Hide Price Toggle */}
        <div className="flex items-start space-x-4 p-4 rounded-[12px] bg-cream/20 border border-light-border">
          <div className="flex items-center h-5 mt-1">
            <input
              id="hidePrice"
              type="checkbox"
              checked={settings.hidePrice}
              onChange={(e) => setSettings({ ...settings, hidePrice: e.target.checked })}
              className="w-5 h-5 text-forest border-gray-300 rounded focus:ring-forest focus:ring-offset-2"
            />
          </div>
          <label htmlFor="hidePrice" className="flex flex-col cursor-pointer">
            <span className="font-medium text-dark">Hide Price on Website</span>
            <span className="text-sm text-muted">
              If enabled, prices will be hidden across the site and replaced with "Price confirmed upon request".
            </span>
          </label>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? "Saving..." : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </button>

      </form>
    </div>
  );
}
